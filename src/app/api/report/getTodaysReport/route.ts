import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/reportModel";
import { NextResponse } from "next/server";


connect();

export async function POST(){
    try { 
        const report = await Reports.find({date: new Date(Date.now()).toISOString().split("T")[0]}).sort({ time: -1 });
          
        return NextResponse.json({
            mesage: "fetch todays reports successfully", 
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