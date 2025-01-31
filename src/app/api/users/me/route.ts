import { NextRequest,NextResponse } from "next/server";
import getDataFromToken from "@/helpers/getDataFromToken";
import Users from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest){
    try {
        const user = await getDataFromToken(request);
        const userFound = await Users.findOne({_id: user?.id}).select("-password");  // we dont want password
        return NextResponse.json({message: "user Found", data: userFound})
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}