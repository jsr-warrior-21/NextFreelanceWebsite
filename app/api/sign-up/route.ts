import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    // 1. Check for ANY user with this username (verified or unverified)
    const existingUserByUsername = await UserModel.findOne({ username });
    
    if (existingUserByUsername) {
      // If the username exists and is verified, reject it immediately
      if (existingUserByUsername.isVerified) {
        return Response.json(
          { success: false, message: "Username is already taken." },
          { status: 400 }
        );
      } else {
        // If the username exists but is UNVERIFIED, check if it belongs to a different email
        if (existingUserByUsername.email !== email) {
          return Response.json(
            { success: false, message: "Username is taken by an unverified account. Try another." },
            { status: 400 }
          );
        }
      }
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email." },
          { status: 400 },
        );
      } else {
        // User exists with this email but isn't verified -> Update their code/password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // Completely new user account creation
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message || "Error sending verification email.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup validation route failure:", error);
    return Response.json(
      {
        success: false,
        message: "An internal error occurred while registering the user.",
      },
      { status: 500 },
    );
  }
}
