import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check for user existence
    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.userName,
      email: user.email,
    };

    // Ensure TOKEN_SEC is set
    if (!process.env.TOKEN_SEC) {
      throw new Error("TOKEN_SEC environment variable is not defined");
    }

    // Create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SEC, { expiresIn: "1d" });

    // Set token in cookie
    const response = NextResponse.json({ message: "Login successful", success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    // Use `unknown` and narrow it to `Error` where necessary
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
