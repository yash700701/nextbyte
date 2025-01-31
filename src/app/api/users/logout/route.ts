import { NextResponse } from "next/server";

export async function GET(){
    try {
        const response = NextResponse.json({message: "logout success", success: true})
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)})
        return response;
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }

}