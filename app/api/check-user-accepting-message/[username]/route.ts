import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  await dbConnect();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user accepting messages status:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking status",
      },
      { status: 500 }
    );
  }
}
