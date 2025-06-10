"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, PlusCircle, Edit, Trash2, LightbulbIcon } from "lucide-react";
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

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Prompt {
  id: string;
  title: string;
  tags: string[];
  updatedAt: string;
}

// Memoized Table Row for Prompts within Project Detail
const ProjectPromptRow = React.memo(({ prompt, onEdit, onDelete }: { prompt: Prompt, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  return (
    <TableRow key={prompt.id} className="border-b-border">
      <TableCell className="font-medium py-3">{prompt.title}</TableCell>
      <TableCell className="hidden sm:table-cell py-3 text-muted-foreground">{prompt.tags.join(", ")}</TableCell>
      <TableCell className="hidden md:table-cell py-3 text-muted-foreground">{new Date(prompt.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell className="text-right space-x-1 py-3">
        <Button variant="ghost" size="sm" className="hover:bg-muted" onClick={() => onEdit(prompt.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Delete Prompt" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the prompt "{prompt.title}". This action cannot be undone.
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
ProjectPromptRow.displayName = 'ProjectPromptRow';


export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        setIsLoadingProject(true);
        setError(null);
        try {
          const response = await fetch(`/api/projects/${projectId}`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to fetch project details");
          }
          const data = await response.json();
          setProject(data);
          setNewName(data.name);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoadingProject(false);
        }
      };

      const fetchProjectPrompts = async () => {
        setIsLoadingPrompts(true);
        setPromptError(null);
        try {
          const response = await fetch(`/api/prompts?projectId=${projectId}`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to fetch prompts for project");
          }
          const data = await response.json();
          setPrompts(data);
        } catch (err: any) {
          setPromptError(err.message);
        } finally {
          setIsLoadingPrompts(false);
        }
      };

      fetchProjectDetails();
      fetchProjectPrompts();
    }
  }, [projectId]);

  const handleNameUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || newName === project.name || !newName.trim()) {
      setIsEditingName(false);
      if (project) setNewName(project.name);
      if (!newName.trim()) setError("Project name cannot be empty.");
      return;
    }
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update project name");
      }
      const updatedProject = await response.json();
      setProject(updatedProject);
      setNewName(updatedProject.name);
      setIsEditingName(false);
    } catch (err: any) {
      setError(err.message);
    }
  }, [project, newName, projectId]);

  const handleDeletePrompt = useCallback(async (promptIdToDelete: string) => {
    setPromptError(null);
    try {
        const response = await fetch(`/api/prompts/${promptIdToDelete}`, { method: "DELETE" });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to delete prompt.");
        }
        setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptIdToDelete));
    } catch (err:any) {
        setPromptError(err.message);
    }
  }, []);

  const handleEditPrompt = useCallback((promptIdToEdit: string) => {
    router.push(`/prompts/${promptIdToEdit}`);
  }, [router]);


  if (isLoadingProject) return <div className="p-6 text-muted-foreground">Loading project details...</div>;
  if (error && !project) return <div className="p-6 text-destructive bg-destructive/10 border border-destructive/20 rounded-md">Error: {error} <Button variant="outline" onClick={() => router.push('/projects')} className="mt-2">Back to Projects</Button></div>;
  if (!project) return <div className="p-6 text-muted-foreground">Project not found. <Button variant="outline" onClick={() => router.push('/projects')}>Back to Projects</Button></div>;

  return (
    <div className="p-4 py-6 md:p-8 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/projects')} className="mb-2 inline-flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Projects
      </Button>

      <Card className="border-none shadow-none">
        <CardHeader className="px-2 md:px-0 pb-4">
          {!isEditingName ? (
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
              <div className="flex-1">
                <CardTitle className="text-2xl leading-tight">{project.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Created on: {new Date(project.createdAt).toLocaleDateString()} | Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)} className="mt-2 sm:mt-0">
                <Edit className="mr-2 h-3 w-3" /> Edit Name
              </Button>
            </div>
          ) : (
            <form onSubmit={handleNameUpdate} className="space-y-3">
              <Label htmlFor="projectName" className="text-sm font-medium">Edit Project Name</Label>
              <Input
                id="projectName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-background hover:bg-muted/50"
              />
              <div className="flex space-x-2 pt-1">
                <Button type="submit" size="sm">Save Changes</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditingName(false); setNewName(project.name); setError(null); }}>Cancel</Button>
              </div>
            </form>
          )}
           {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardHeader>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row justify-between items-center px-2 md:px-0 pt-4 pb-3">
          <CardTitle className="text-xl">Prompts in this Project</CardTitle>
          <Button asChild size="sm">
            <Link href={`/prompts/new?projectId=${projectId}&projectName=${encodeURIComponent(project.name)}`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Prompt
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {promptError && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4 mx-2 md:mx-0">{promptError}</p>}
          {isLoadingPrompts ? (
            <p className="text-muted-foreground px-2 md:px-0">Loading prompts...</p>
          ) : prompts.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg mx-2 md:mx-0">
              <LightbulbIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1 text-foreground">No Prompts Here Yet</h3>
              <p className="text-sm text-muted-foreground mb-3">Get started by adding a new prompt to this project.</p>
              <Button asChild size="sm">
                <Link href={`/prompts/new?projectId=${projectId}&projectName=${encodeURIComponent(project.name)}`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First Prompt
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-border">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Tags</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Last Updated</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prompts.map((promptItem) => (
                  <ProjectPromptRow
                    key={promptItem.id}
                    prompt={promptItem}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePrompt}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
