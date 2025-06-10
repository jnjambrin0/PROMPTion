import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link"; // For "Sign up" link

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const callbackUrlError = searchParams?.get("error");
    if (callbackUrlError) {
      if (callbackUrlError === "CredentialsSignin") {
        setError("Invalid email or password. Please try again.");
      } else if (callbackUrlError === "OAuthAccountNotLinked") {
        setError("This email is already linked with another provider. Please sign in using that method.");
      }
      else {
        setError("An unexpected error occurred during sign-in. Please try again.");
      }
    }
    const successMessage = searchParams?.get("message");
    if (successMessage) {
      setMessage(successMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Both email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Sign-in error:", result.error);
         if (result.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else {
          setError(`Login Error: ${result.error}`);
        }
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login submit error:", err);
      setError("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use bg-background from global styles
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Optional: Add an App Logo or Name above the card */}
      {/* <h1 className="text-3xl font-semibold text-primary mb-8">MyApp</h1> */}

      <Card className="w-full max-w-sm border-border shadow-lg"> {/* Subtle shadow, border from global */}
        <CardHeader className="space-y-1 text-center px-6 pt-6">
          <CardTitle className="text-2xl tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 py-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-primary/10 border border-primary/20 text-primary text-sm p-3 rounded-md text-center" role="alert">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background hover:bg-muted/50 focus:border-primary" // Subtle input styling
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background hover:bg-muted/50 focus:border-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <Button type="submit" className="w-full" size="default" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="underline hover:text-primary">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
