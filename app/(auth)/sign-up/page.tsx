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
import { Loader2 } from "lucide-react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm({
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
          `/api/check-username-unique?username=${username}`,
        );
        setUsernameMessage(response.data?.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data?.message ?? "Error checking username.",
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);

      toast.add({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verfiy/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in sign-up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: "signup failed",
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        {/* form start here */}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel>Username</FieldLabel>

                {/* Container for input and message layout */}
                <div className="flex flex-col gap-2 w-full">
                  {/* Relative wrapper ONLY for the Input and the Loader Spinner */}
                  <div className="relative flex items-center w-full">
                    <Input
                      type="text"
                      placeholder="username"
                      className="pr-10 w-full"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Status message placed below the input with a modern UI animation finish */}
                  {usernameMessage && (
                    <p
                      className={`text-xs sm:text-sm font-medium transition-all duration-200 ${
                        usernameMessage === "Username is unique"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
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
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="email" {...field} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="password" {...field} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Signup"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already a member?{""}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
