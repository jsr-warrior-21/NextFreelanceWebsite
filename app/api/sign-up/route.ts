import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    const userExistringByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (userExistringByUsername) {
      return Response.json(
        {
          success: false,
          message: "User with this username already exist.",
        },
        {
          status: 400,
        },
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already Exist." },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
        await existingUserByEmail.save();
      }
    } else {
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

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode,
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: "Error in sending email to user." },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification Email send to the User.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Error  while registering user",
      },
      {
        status: 500,
      },
    );
  }
}
