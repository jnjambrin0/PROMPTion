"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react"; // Added React, useCallback, useMemo
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

// (Interfaces Prompt, Project remain the same)
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  projectId?: string | null;
  project?: { name: string };
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}


// Memoized Table Row Item
const PromptRow = React.memo(({ prompt, projects, onDelete, onEdit }: { prompt: Prompt, projects: Project[], onDelete: (id: string) => void, onEdit: (id: string) => void }) => {
  const project = useMemo(() =>
    projects.find(p => p.id === prompt.projectId) || null
  , [projects, prompt.projectId]);

  return (
    <TableRow key={prompt.id} className="border-b-border">
      <TableCell className="font-medium py-3">{prompt.title}</TableCell>
      <TableCell className="hidden sm:table-cell py-3 text-muted-foreground">
        {project?.name || (prompt.projectId ? 'N/A' : <span className="italic">General</span>)}
      </TableCell>
      <TableCell className="py-3 text-muted-foreground">{prompt.tags.join(", ")}</TableCell>
      <TableCell className="py-3 text-muted-foreground">{new Date(prompt.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell className="text-right space-x-1 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(prompt.id)}
          className="hover:bg-muted"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the prompt "{prompt.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(prompt.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
});
PromptRow.displayName = 'PromptRow';


export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Slightly reduced debounce for responsiveness
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        setProjects(await response.json());
      } catch (err) {
        console.error("Error fetching projects for filter:", err);
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []); // Empty dependency array: fetch projects only once

  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedProjectId !== "all") {
        params.append("projectId", selectedProjectId === "none" ? "null" : selectedProjectId);
      }
      if (debouncedSearchQuery) {
        params.append("searchQuery", debouncedSearchQuery);
      }
      const url = `/api/prompts?${params.toString()}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch prompts: ${response.statusText}`);
        }
        // Assuming API returns prompts without full content now
        const data = await response.json();
        setPrompts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, [selectedProjectId, debouncedSearchQuery]); // Dependencies are correct

  const handleDeletePrompt = useCallback(async (promptId: string) => {
    // setError(null); // Clear previous errors before new action
    try {
      const response = await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete prompt");
      }
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptId));
    } catch (err: any) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  }, []); // Empty dependency array for handleDeletePrompt, as it doesn't depend on component state directly other than through args

  const handleEditPrompt = useCallback((promptId: string) => {
    router.push(`/prompts/${promptId}`);
  }, [router]);

  const displayedPrompts = useMemo(() => {
    // Client-side filtering for 'none' is less necessary if API handles `projectId=null`
    // but can be kept for robustness with mock or if API doesn't filter perfectly for "null" string.
    if (selectedProjectId === "none" && !debouncedSearchQuery) { // Only apply this specific client filter if no search is active
        return prompts.filter(p => !p.projectId);
    }
    return prompts;
  }, [prompts, selectedProjectId, debouncedSearchQuery]);


  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold">My Prompts</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[200px] md:w-[250px]"
            />
            <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <XIcon size={16} />
              </Button>
            )}
          </div>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId} // This is already stable
            disabled={isProjectsLoading || isLoading}
          >
            <SelectTrigger className="w-full sm:w-auto md:w-[200px] bg-background hover:bg-muted/80">
              <SelectValue placeholder={isProjectsLoading ? "Loading..." : "Filter by project"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prompts</SelectItem>
              <SelectItem value="none">General (No Project)</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild className="w-full sm:w-auto" size="sm">
            <Link href="/prompts/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
         <div className="text-center py-10 text-muted-foreground">Loading prompts...</div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <h3 className="text-xl font-semibold mb-2">Error Fetching Prompts</h3>
          <p>{error}</p>
        </div>
      ) : displayedPrompts.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-foreground">No Prompts Found</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearchQuery && `Your search for "${debouncedSearchQuery}" did not match any prompts.`}
            {!debouncedSearchQuery && selectedProjectId === "all" && "You haven't created any prompts yet. Get started by creating one!"}
            {!debouncedSearchQuery && selectedProjectId === "none" && "No general prompts found (not assigned to a project)."}
            {!debouncedSearchQuery && selectedProjectId !== "all" && selectedProjectId !== "none" &&
             `No prompts found for project: ${projects.find(p=>p.id === selectedProjectId)?.name || 'selected project'}.`}
          </p>
          {debouncedSearchQuery && (
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchQuery("")}>Clear Search</Button>
          )}
          {/* CTA to create prompt only if no search query is active and list is empty for other reasons */}
          {!debouncedSearchQuery && (
             <Button size="sm" className="mt-4" asChild>
               <Link href="/prompts/new"><PlusCircle className="mr-2 h-4 w-4"/>Create First Prompt</Link>
            </Button>
          )}
        </div>
      ) : (
        <Card className="border-none shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="border-b-border">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">Project</TableHead>
              <TableHead className="text-muted-foreground">Tags</TableHead>
              <TableHead className="text-muted-foreground">Last Updated</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPrompts.map((prompt) => (
              <PromptRow
                key={prompt.id}
                prompt={prompt}
                projects={projects}
                onDelete={handleDeletePrompt}
                onEdit={handleEditPrompt}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
      )}
    </div>
  );
}
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the prompt
                          "{prompt.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePrompt(prompt.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
