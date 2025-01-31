import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id } = reqBody;

    // Check for user existence
    await Users.deleteOne({_id: id});
    NextResponse.json({
        message: "delete success"
    })

  } catch (error: unknown) {
    // Use `unknown` and narrow it to `Error` where necessary
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
