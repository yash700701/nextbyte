import { NextRequest, NextResponse } from "next/server";
import getDataFromToken from "@/helpers/getDataFromToken";
import Users from "@/models/userModel";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { adminKey } = reqBody;

        // Validate admin key
        if (adminKey !== process.env.ADMIN_KEY) {
            return NextResponse.json(
                {
                    message: "Invalid admin key",
                    success: false,
                },
                { status: 403 }
            );
        }

        // Extract user ID from token
        const res = await getDataFromToken(request);
        const resId = res?.id;
        if (!resId) {
            return NextResponse.json(
                {
                    message: "Invalid or missing token",
                    success: false,
                },
                { status: 401 }
            );
        }

        // Find the user
        const user = await Users.findById(resId);
        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        // Update user admin status
        user.isAdmin = true;
        await user.save();

        return NextResponse.json({
            message: "User has been granted admin privileges successfully.",
            success: true,
        });

    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}
