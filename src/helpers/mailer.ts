import nodemailer from 'nodemailer';
import Users from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { AxiosError } from 'axios';

interface SendEmailProps {
    email: string;
    emailType: "VERIFY" | "RESET";
    userId: string;
  }

export const sendEmail = async({email, emailType, userId}: SendEmailProps)=>{
    try {
        
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if(emailType === "VERIFY"){
            await Users.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            })
        }else if(emailType === "RESET"){
            await Users.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            })
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            // host: "sandbox.smtp.mailtrap.",
            service: "gmail",
            // port: 2525,
            auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
            }
        });
        const mailOptions = {
            from: 'yashtiwari700714@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "verify your email" : "resret your password",
            html: `<p> click <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyEmail" : "resetPassword"}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "resret your password"}</p>`
        }

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.message)
          } else {
            console.error("Unexpected error", error);
          }
    }
}