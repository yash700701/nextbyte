import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { AxiosError } from "axios";

interface DecodedToken {
    id: string,
    username: string,
    email: string,
  }

export default function getDataFromToken(request: NextRequest){
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, process.env.TOKEN_SEC!) as DecodedToken;
        return decodedToken
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.message)
          } else {
            console.error("Unexpected error", error);
          }
    }
}