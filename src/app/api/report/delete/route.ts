import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/reportModel";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest){
    try { 
        const reqBody = await request.json()
        const { email } = reqBody
        const report = await Reports.deleteMany({email})
          
        return NextResponse.json({
            status: true,
            report
        })
        
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}