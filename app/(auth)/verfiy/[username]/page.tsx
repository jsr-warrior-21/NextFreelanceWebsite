"use client";

import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { Controller, useForm } from "react-hook-form";
import { verifyScheme } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, use } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export default function ValidateUser() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifyScheme>>({
    resolver: zodResolver(verifyScheme),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyScheme>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-user`, {
        username,
        code: data.code,
      });

      toast.add({
        title: "Account Verified!",
        description: response.data.message || "Your account has been successfully verified. Please sign in.",
      });

      // Correct absolute path redirection to /sign-in
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: "Verification Failed",
        description: errorMessage || "Invalid code provided.",
      });
    } finally {
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
            Verify Your Account
          </h1>
          <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
            Enter the 6-digit verification code sent to your email for{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              @{username}
            </span>
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Verification Code
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="123456"
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-center tracking-widest text-lg font-mono"
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
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Verify Account
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Already verified?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-slate-900 dark:text-white hover:underline ml-1"
            >
              Sign In
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
