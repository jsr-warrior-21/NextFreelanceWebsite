import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get("username");

    // 1. Defend against function-string injection leaks from the debounce wrapper
    if (
      rawUsername &&
      (rawUsername.includes("=>") || rawUsername.includes("function"))
    ) {
      return Response.json(
        { success: false, message: "Invalid username format" },
        { status: 400 },
      );
    }

    const queryParam = { username: rawUsername };
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username format", // Fixed typo: format
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    // 2. Look for ANY user document with this username (verified or unverified)
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }, // Explicitly send 400 status for validation failure
      );
    }

    // 3. Clear to proceed
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during validation of unique username:", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking unique username",
      },
      { status: 500 }, // Changed from 401 (Unauthorized) to 500 (Internal Server Error)
    );
  }
}
