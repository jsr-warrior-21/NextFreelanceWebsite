"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MessageSquare, UserPlus } from "lucide-react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
      }

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data?.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data?.message ?? "Error checking username."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };
    if (username.trim().length >= 2) {
      checkUsernameUnique();
    }
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);

      toast.add({
        title: "Success",
        description: response.data.message || "Account created! Please verify your email.",
      });

      router.replace(`/verfiy/${data.username}`);
    } catch (error) {
      console.error("Error in sign-up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: "Signup Failed",
        description: errorMessage || "Failed to create account.",
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
            Join Mystery Message
          </h1>
          <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
            Create an account to start your anonymous adventure
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Username
                </FieldLabel>
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="relative flex items-center w-full">
                    <Input
                      type="text"
                      placeholder="johndoe"
                      className="pr-10 w-full rounded-xl border-slate-200 dark:border-slate-800"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}
                  </div>

                  {usernameMessage && (
                    <p
                      className={`text-xs font-medium ${
                        usernameMessage === "Username is unique"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                </div>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Email
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
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
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Sign Up
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Already a member?{" "}
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
