"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react"; // Added useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

export default function NewPromptPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [aiOptIn, setAiOptIn] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-select project if projectId is in query params
    const projectIdFromQuery = searchParams?.get("projectId");
    if (projectIdFromQuery) {
      setSelectedProjectId(projectIdFromQuery);
    }

    // Fetch projects for the dropdown
    const fetchProjects = async () => {
      setIsProjectsLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        // Handle error fetching projects (e.g., show a toast or small error message)
        console.error("Error fetching projects for dropdown:", err);
        setError("Could not load projects for selection."); // Or a more subtle error
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title || !content) {
      setError("Title and content are required.");
      setIsLoading(false);
      return;
    }

    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
    const requestBody: any = {
      title,
      content,
      tags: tagsArray,
      aiOptIn,
      ...(selectedProjectId && selectedProjectId !== "none" && { projectId: selectedProjectId })
    };


    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create prompt");
      }

      const newPrompt = await response.json();
      router.push(`/prompts/${newPrompt.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const projectNameFromQuery = searchParams?.get("projectName");

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create New Prompt</CardTitle>
          {projectNameFromQuery ? (
            <CardDescription>For project: <strong>{decodeURIComponent(projectNameFromQuery)}</strong>. Fill in the details for your new prompt.</CardDescription>
          ) : (
            <CardDescription>Fill in the details for your new prompt. You can optionally assign it to a project.</CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Awesome Prompt"
                disabled={isLoading}
              />
            </div>
             <div className="space-y-1">
              <Label htmlFor="project">Project (Optional)</Label>
              <Select
                value={selectedProjectId || "none"}
                onValueChange={(value) => setSelectedProjectId(value === "none" ? undefined : value)}
                disabled={isProjectsLoading || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isProjectsLoading ? "Loading projects..." : "Select a project"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General (No Project)</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the prompt content here..."
                rows={10}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., marketing, writing, inspiration"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="aiOptIn"
                checked={aiOptIn}
                onCheckedChange={(checked) => setAiOptIn(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="aiOptIn" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Enable AI assistance (scoring, improvement suggestions)
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || isProjectsLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Prompt"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
