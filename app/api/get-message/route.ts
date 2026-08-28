import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userResult = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userResult || userResult.length === 0) {
      // Check if user actually exists
      const foundUser = await UserModel.findById(userId);
      if (!foundUser) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // User exists but has no messages yet -> return empty array with status 200
      return Response.json(
        {
          success: true,
          messages: [],
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userResult[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}
