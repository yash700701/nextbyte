"use client"

import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function VerifyEmailPage(){
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter()

    const verifyUserEmail = useCallback(async () => {
      try {
        await axios.post("/api/users/verifyemail", { token });
        setVerified(true);
        router.push("/login");
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(true);
          console.log(error);
        } else {
          console.error("Unexpected error", error);
        }
      }
    },[router, token]);

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    },[])
    useEffect(()=>{
        if(token.length > 0){
            verifyUserEmail()
        }
    },[token, verifyUserEmail])

    return(
        <div className="mt-40 bg-white ml-10 text-center h-screen">
         {verified && (
           <div>
             <h1 className="text-green-700">signup successfully</h1>
             <h1 className="text-green-700">redirecting to login page</h1>
           </div>
         )}
         {error && (
           <div>
             <h1>there is an error</h1> 
           </div>
         )}
        </div>
    )

}