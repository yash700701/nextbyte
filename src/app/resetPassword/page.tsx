"use client"

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';


export default function VerifyResetPassword() {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const verifyPassword = async () => {
        try {
            setLoading(true);
            await axios.post('/api/users/verifypassword', { token, newPassword });
            setVerified(true);
            router.push("/")
            
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "There was an error resetting the password");
              } else {
                console.error("Unexpected error", error);
              }
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    },[])
   
    return (
        <>
            

            <div className="h-screen text-black bg-white flex pt-32 flex-col items-center">
                <h1 className="mx-1 text-sm p-2">Enter new password</h1>
                <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    className="p-1 border-black w-80 rounded-lg border-[1px] mx-1"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <Button
                    className="p-1 w-80 mt-3 shadow-md border-[1px] border-black rounded-lg mx-1 hover:text-green-500"
                    onClick={verifyPassword}
                    disabled={loading || !newPassword}
                >
                    {loading ? "Processing..." : "Set Password"}
                </Button>
            </div>

            {verified && (
                <div>
                    <h1>Password changed successfully!</h1>
                </div>
            )}

            {error && (
                <div>
                    <h1 className="text-red-500">{error}</h1>
                </div>
            )}
        </>
    );
}
