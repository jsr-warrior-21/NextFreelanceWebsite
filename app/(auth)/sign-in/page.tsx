"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signInScheme } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft, Loader2, LogIn, MessageSquare } from "lucide-react";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInScheme>>({
    resolver: zodResolver(signInScheme),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInScheme>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.add({
          title: "Login Failed",
          description: "Incorrect email/username or password.",
        });
        setIsSubmitting(false);
        return;
      }

      if (result?.url) {
        toast.add({
          title: "Welcome Back!",
          description: "Successfully logged in.",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.add({
        title: "Error",
        description: "An unexpected error occurred during sign in.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Home Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link href="/" className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
          <MessageSquare className="w-5 h-5" />
          <span>Mystery Message</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard and messages
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Email or Username
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter your email or username"
                  className="rounded-xl border-slate-200 dark:border-slate-800"
                  {...field}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Password
                </FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 dark:border-slate-800"
                  {...field}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-slate-900 dark:text-white hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <footer className="text-center text-xs font-medium text-slate-400">
        © 2026 Mystery Message
      </footer>
    </div>
  );
}
