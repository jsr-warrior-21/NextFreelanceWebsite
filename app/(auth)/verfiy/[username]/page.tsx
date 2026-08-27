"use client"
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { Controller, useForm } from "react-hook-form";
import { verifyScheme } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";
import { Field, FieldError } from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@base-ui/react/input";

export default function ValidateUser() {
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof verifyScheme>>({
    resolver: zodResolver(verifyScheme),
  });

  const onSubmit = async (data: z.infer<typeof verifyScheme>) => {
    try {
      const response = await axios.post(`/api/verify-user`, {
        username: params.username,
        code: data.code,
      });

      toast.add({
        title: "Success",
        description: response.data.message,
      });
      router.replace("sign-in");
    } catch (error) {
      console.error("Error in sign-up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.add({
        title: "signup failed",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel>Verification Code</FieldLabel>
                <Input type="code" placeholder="code" {...field} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </form>
      </div>
    </div>
  );
}
