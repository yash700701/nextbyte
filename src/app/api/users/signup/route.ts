import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest){
    try { 
        const reqBody = await request.json()
        const {name, email, password, url, job} = reqBody
        const user = await User.findOne({email})
        
        if(user){
            return NextResponse.json({error: "user already exist"}, {status: 400})
        }

        // hashing password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // create new user
        const newUser = new User({
            userName: name,
            email: email,
            password: hashedPassword,
            imgUrl: url,
            jobProfile: job,
        })
        
        
        const savedUser = await newUser.save()
       

        // send verification email
        await sendEmail({email: email, emailType: "VERIFY", userId: savedUser._id})
        
        
        return NextResponse.json({
            mesage: "user created succsessfully", 
            status: true,
            savedUser
        })
        
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}