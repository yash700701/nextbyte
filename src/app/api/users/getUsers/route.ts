import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const users = await Users.find({ isAdmin: false });

    return NextResponse.json({
      message: "Fetched profiles successfully",
      users, // Return the fetched users
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
