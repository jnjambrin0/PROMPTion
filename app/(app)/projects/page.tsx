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
import { PlusCircle, Edit, Trash2, FolderOpen } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// (Interface Project remains the same)
interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add _count if you query for prompt counts
}

// Memoized Table Row Item for Projects
const ProjectRow = React.memo(({ project, onDelete, onView }: { project: Project, onDelete: (id: string) => void, onView: (id: string) => void }) => {
  return (
    <TableRow key={project.id} className="border-b-border">
      <TableCell className="font-medium py-3">{project.name}</TableCell>
      <TableCell className="hidden sm:table-cell py-3 text-muted-foreground">
        {new Date(project.updatedAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right space-x-1 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(project.id)}
          title="View Project Details"
          className="hover:bg-muted"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Delete Project" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project
                "{project.name}" and disassociate its prompts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(project.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
});
ProjectRow.displayName = 'ProjectRow';


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []); // Correct: Fetch projects once on mount

  const handleDeleteProject = useCallback(async (projectId: string) => {
    // setError(null); // Optional: clear previous general errors
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }
      setProjects(prevProjects => prevProjects.filter((p) => p.id !== projectId));
    } catch (err: any) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  }, []); // useCallback with empty dependency array

  const handleViewProject = useCallback((projectId: string) => {
    router.push(`/projects/${projectId}`);
  }, [router]); // useCallback with router dependency

  // Main content area
  return (
    <div className="p-4 py-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Link>
        </Button>
      </div>

      {isLoading ? (
         <div className="text-center py-10 text-muted-foreground">Loading projects...</div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <h3 className="text-xl font-semibold mb-2">Error Fetching Projects</h3>
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
         <Card className="mt-6 border-2 border-dashed border-muted rounded-lg">
          <CardHeader className="items-center text-center">
            <FolderKanbanIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <CardTitle>No Projects Yet</CardTitle>
            <CardDescription className="text-muted-foreground">
              Projects help you organize your prompts. Get started by creating your first one.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="sm">
              <Link href="/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="border-b-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Last Updated</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onView={handleViewProject}
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
                          This action cannot be undone. This will permanently delete the project
                          "{project.name}" and disassociate its prompts.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
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
