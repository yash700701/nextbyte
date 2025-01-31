import { NextRequest, NextResponse } from "next/server";
import Users from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {email} = reqBody;
        const user = await Users.findOne({email}) 
        await sendEmail({email: email, emailType: "RESET", userId: user._id})
        return NextResponse.json({
            message: "password reset success",
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