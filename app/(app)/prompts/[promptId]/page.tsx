"use client";

import React, { useEffect, useState, useCallback } from "react"; // Removed useMemo as it's not heavily used here for now
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
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
import { ArrowLeft, Trash2, Sparkles, Wand2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
}

interface PromptData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  aiOptIn?: boolean;
  projectId?: string | null;
}

interface AIScoreResponse {
  score: number | null;
  feedback: string | null;
  error: string | null;
}

interface AIImproveResponse {
  improvedPrompt: string | null;
  error: string | null;
}

// It's generally good practice to define components used only here or make them more generic if used elsewhere.
// For simplicity, keeping sub-components like AI sections inline unless they become very large or are reused.

export default function PromptEditorPage() {
  // Form field states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [aiOptIn, setAiOptIn] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null | undefined>(undefined);

  // Data states
  const [prompt, setPrompt] = useState<PromptData | null>(null); // Stores the initially fetched prompt
  const [projects, setProjects] = useState<Project[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true); // For initial prompt data load
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  // API response states
  const [aiScore, setAiScore] = useState<AIScoreResponse | null>(null);
  const [aiImprovedSuggestion, setAiImprovedSuggestion] = useState<string | null>(null);
  const [aiImproveError, setAiImproveError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // General page/form errors

  const router = useRouter();
  const params = useParams();
  const promptId = params?.promptId as string;

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjectsForDropdown = async () => {
      setIsProjectsLoading(true);
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        setProjects(await response.json());
      } catch (err) {
        console.error("Error fetching projects for editor dropdown:", err);
        // setError("Could not load projects. Saving might not link to a project."); // Non-critical error
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjectsForDropdown();
  }, []); // Fetch projects only once

  // Fetch prompt data
  useEffect(() => {
    if (promptId) {
      const fetchPromptData = async () => {
        setIsLoading(true);
        setError(null);
        setAiScore(null);
        setAiImprovedSuggestion(null);
        setAiImproveError(null);
        try {
          const response = await fetch(`/api/prompts/${promptId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch prompt: ${response.statusText}`);
          }
          const data: PromptData = await response.json();
          setPrompt(data); // Store initial prompt
          setTitle(data.title);
          setContent(data.content);
          setTags(data.tags.join(", "));
          setAiOptIn(data.aiOptIn || false);
          setSelectedProjectId(data.projectId || null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPromptData();
    }
  }, [promptId]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
    const requestBody = {
      title,
      content,
      tags: tagsArray,
      aiOptIn,
      projectId: selectedProjectId === "none" || selectedProjectId === null ? null : selectedProjectId,
    };
    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update prompt");
      }
      router.push("/prompts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [promptId, title, content, tags, aiOptIn, selectedProjectId, router]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete prompt");
      }
      router.push("/prompts");
    } catch (err: any) {
      setError(err.message);
      // Consider resetting isDeleting here if preferred:
      // setIsDeleting(false);
    }
    // No finally block for setIsDeleting(false) to prevent button re-enable if error and still on page
  }, [promptId, router]);

  const handleScorePrompt = useCallback(async () => {
    if (!content) {
      setAiScore({ score: null, feedback: "Prompt content is empty.", error: "Cannot score empty prompt." });
      return;
    }
    setIsScoring(true);
    setAiScore(null);
    try {
      const response = await fetch('/api/openai/score-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptContent: content }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to score prompt");
      }
      setAiScore(await response.json());
    } catch (err: any) {
      setAiScore({ score: null, feedback: null, error: err.message });
    } finally {
      setIsScoring(false);
    }
  }, [content]);

  const handleImprovePrompt = useCallback(async () => {
    if (!content) {
      setAiImproveError("Prompt content is empty.");
      setAiImprovedSuggestion(null);
      return;
    }
    setIsImproving(true);
    setAiImprovedSuggestion(null);
    setAiImproveError(null);
    try {
      const response = await fetch('/api/openai/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptContent: content,
          promptFeedback: aiScore?.feedback
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to get improvement suggestion");
      }
      const improvementData: AIImproveResponse = await response.json();
      if (improvementData.error) {
        setAiImproveError(improvementData.error);
      } else {
        setAiImprovedSuggestion(improvementData.improvedPrompt);
      }
    } catch (err: any) {
      setAiImproveError(err.message);
    } finally {
      setIsImproving(false);
    }
  }, [content, aiScore?.feedback]);

  const acceptSuggestion = useCallback(() => {
    if (aiImprovedSuggestion) {
      setContent(aiImprovedSuggestion);
      setAiImprovedSuggestion(null);
      setAiImproveError(null);
    }
  }, [aiImprovedSuggestion]);

  const rejectSuggestion = useCallback(() => {
    setAiImprovedSuggestion(null);
    setAiImproveError(null);
  }, []);

  if (isLoading && !prompt) return <div className="p-4 text-muted-foreground">Loading prompt editor...</div>;
  if (error && !prompt) return <div className="p-4 text-destructive bg-destructive/10 rounded-md">Error loading prompt: {error} <Button variant="outline" onClick={() => router.push('/prompts')} className="mt-2">Back to Prompts</Button></div>;
  if (!prompt && !isLoading) return <div className="p-4 text-muted-foreground">Prompt not found. <Button variant="outline" onClick={() => router.push('/prompts')}>Back to Prompts</Button></div>;

  return (
    <div className="p-4 py-6 md:p-8 max-w-3xl mx-auto">
       <Button variant="ghost" size="sm" onClick={() => router.push('/prompts')} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prompts
      </Button>
      <Card className="border-none shadow-none">
        <CardHeader className="px-2 md:px-0">
          <CardTitle className="text-2xl">Edit Prompt</CardTitle>
          <CardDescription className="text-muted-foreground">
            Update details, manage AI assistance, and save your changes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-2 md:px-0">
            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSaving || isDeleting || isScoring || isProjectsLoading} className="bg-background hover:bg-muted/50"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium">Project</Label>
              <Select value={selectedProjectId === null ? "none" : selectedProjectId || undefined} onValueChange={(value) => setSelectedProjectId(value === "none" ? null : value)} disabled={isProjectsLoading || isSaving || isDeleting || isScoring}>
                <SelectTrigger className="bg-background hover:bg-muted/50">
                  <SelectValue placeholder={isProjectsLoading ? "Loading projects..." : "Select a project (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General (No Project)</SelectItem>
                  {projects.map((p) => ( <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem> ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">Content</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} disabled={isSaving || isDeleting || isScoring || isImproving} className="bg-background hover:bg-muted/50 min-h-[200px]"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} disabled={isSaving || isDeleting || isScoring || isImproving} className="bg-background hover:bg-muted/50"/>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="aiOptIn" checked={aiOptIn} onCheckedChange={(checked) => { setAiOptIn(checked as boolean); if (!(checked as boolean)) { setAiScore(null); setAiImprovedSuggestion(null); setAiImproveError(null);}}} disabled={isSaving || isDeleting || isScoring || isImproving}/>
              <Label htmlFor="aiOptIn" className="text-sm font-normal text-muted-foreground select-none">Enable AI assistance</Label>
            </div>
            {aiOptIn && (
              <Card className="bg-muted/30 p-4 space-y-4 border-border/50">
                <h3 className="text-base font-semibold text-foreground">AI Assistance</h3>
                <div className="space-y-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleScorePrompt} disabled={isScoring || isSaving || !content || isImproving || isProjectsLoading}>
                    <Sparkles className="mr-2 h-4 w-4" /> {isScoring ? "Getting Score..." : "Get AI Score & Feedback"}
                  </Button>
                  {isScoring && <p className="text-xs text-muted-foreground">Requesting AI feedback...</p>}
                  {aiScore && ( <div className={`mt-2 p-3 rounded-md text-xs ${aiScore.error ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary-foreground'}`}> {aiScore.error ? (<p><strong>Scoring Error:</strong> {aiScore.error}</p>) : (<> <p><strong>AI Score:</strong> {aiScore.score}/10</p> <p><strong>AI Feedback:</strong> {aiScore.feedback}</p> </>)}</div>)}
                </div>
                {aiScore && !aiScore.error && (
                  <div className="space-y-2 pt-3 border-t border-border/50">
                    <Button type="button" variant="outline" size="sm" onClick={handleImprovePrompt} disabled={isImproving || isScoring || isSaving || !content || isProjectsLoading}>
                      <Wand2 className="mr-2 h-4 w-4" /> {isImproving ? "Getting Suggestion..." : "Suggest Improvement"}
                    </Button>
                    {isImproving && <p className="text-xs text-muted-foreground">Requesting AI suggestion...</p>}
                    {aiImproveError && <p className="text-xs text-destructive mt-2"><strong>Improvement Error:</strong> {aiImproveError}</p>}
                    {aiImprovedSuggestion && (
                      <div className="mt-2 p-3 rounded-md bg-green-500/10 border border-green-500/20">
                        <Label className="text-sm font-semibold text-green-700 dark:text-green-400">AI Suggestion:</Label>
                        <Textarea value={aiImprovedSuggestion} readOnly rows={Math.max(5, aiImprovedSuggestion.split('\n').length)} className="mt-1 bg-background text-sm"/>
                        <div className="mt-2 space-x-2">
                          <Button type="button" size="xs" onClick={acceptSuggestion} variant="default">Accept</Button>
                          <Button type="button" size="xs" variant="outline" onClick={rejectSuggestion}>Reject</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-8 px-2 md:px-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" size="sm" disabled={isSaving || isDeleting || isScoring || isImproving || isProjectsLoading}>
                  <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete this prompt.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting || isScoring || isImproving}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting || isScoring || isImproving}>{isDeleting ? "Deleting..." : "Yes, delete it"}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" size="sm" disabled={isSaving || isDeleting || isScoring || isImproving || isProjectsLoading}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
