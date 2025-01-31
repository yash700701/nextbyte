import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); // Await the request body
    const { id } = reqBody;

    const users = await Users.findOne({_id: id});

    return NextResponse.json({
      message: "Fetched profile successfully",
      users, // Return the fetched users
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
