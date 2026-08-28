import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "@/emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email.trim(),
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("[Resend API Error]:", error);
      return {
        success: false,
        message:
          error.message ||
          "Failed to send verification email. Resend allowed recipient limit reached.",
      };
    }

    return {
      success: true,
      message: "Successfully sent verification email to user.",
    };
  } catch (emailError) {
    console.error("Error in sending verification email", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
