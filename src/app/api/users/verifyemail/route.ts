import {connect} from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import Users from '@/models/userModel';

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {token} = reqBody
        const user = await Users.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})
        if(!user){
            return NextResponse.json({error: "invalid token"}, {status: 400})
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save()

        return NextResponse.json({
            message: "email verified successfully",
            success: true,
        })

    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}
