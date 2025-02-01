"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import f2 from '@/image/f2.jpg'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Page() {

    type userType = {
        email: string,
        password: string
    }

    const [user, setUser] = useState<userType>({
        email: "",
        password: "",
    })

  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
    const handleLogin = async()=>{
        try {  
            setMessage1("")          
            setLoading1(true)
            console.log(user);
            
            const response = await axios.post("/api/users/login", user)
            setVisible(true)
            console.log("login success", response.data);
            router.replace("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setMessage1("password wrong / internal server error")
                console.log("signup failed", error.message);
                toast.error(error.response?.data?.error || error.message)
              } else {
                console.error("Unexpected error", error);
              }
        } finally {
            setLoading1(false);
        }
    }
    const handleReset = async()=>{
        try {  
            setMessage2("")          
            setLoading2(true)
            
            const response = await axios.post("/api/users/resetPassword", {email})
            setMessage2("password reset link is sent to your email")
            console.log("reset password success", response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log("reset password failed", error.message);
                toast.error(error.response?.data?.error || error.message);
              } else {
                console.error("Unexpected error", error);
              }
        } finally {
            setLoading2(false);
        }
    }

    return(
    <div className='bg-white h-screen'>
       {!visible && (
         <div className='grid lg:grid-cols-2'>
         <div className='mr-2 hidden lg:flex justify-end mt-32 h-screen'>
             <Image
             className=" h-96 w-80 right-0 object-cover"
             src={f2}
             alt="Vercel logomark"
             />
         </div>
         <div className='ml-2 text-black mt-32 flex flex-col items-center lg:items-start'>
             <h1 className='text-3xl font-semibold mb-5'>Login</h1>
             <Input
             type='email'
             placeholder='Email'
             value={user.email}
             onChange={(e)=>{setUser({...user, email: e.target.value})}}
             className='w-80 mb-4  border-[1px] border-black' 
             />
             <Input
             type='password'
             placeholder='Password'
             value={user.password}
             onChange={(e)=>{setUser({...user, password: e.target.value})}}
             className='w-80 mb-2  border-[1px] border-black' 
             />
             <Button onClick={handleLogin} disabled={loading1} className='w-80 shadow-md border-[1px] border-black mt-2'>
                 {loading1 ? "Submitting..." : "Submit"}
             </Button>
             <div className='h-8 w-80'>
             <h1 className='text-center text-red-700 text-xs pt-2 ml-1'>{loading1 ? "": `${message1}`}</h1>
             </div>
             <div className='h-5 w-80 my-2'>
             <h1 className='text-center text-xs pt-2'>_______Forgot Password_______</h1>
             </div>
             <div className='h-8 w-80 '>
             <h1 className='text-center text-green-700 text-xs pt-2 ml-1'>{loading2 ? "": `${message2}`}</h1>
             </div>
             <Input
             type='email'
             placeholder='Email'
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             className='w-80 mb-2  border-[1px] border-black' 
             />
             <Button onClick={handleReset} disabled={loading2} className='w-80 shadow-md border-[1px] border-black mt-2'>
                 {loading2 ? "Submitting..." : "Submit"}
             </Button>
             <h1 className='text-zinc-600 text-xs text-center w-80 mt-5'>Don&apos;t have an account?  
             <span>
                 <Link href="/signup" className='text-blue-600'>
                  Signup
                 </Link>
             </span>
             </h1>
             
         </div>
         </div>
       )}
       {visible && (
        <div className='mt-32 flex flex-col items-center'>
        <h1>Login Successfully</h1>
        <h1>go to <span>
            <Link className='text-blue-600 font-semibold' href="/">
            home page
            </Link>
        </span> / refresh</h1>

        </div>
       )}
    </div>
    )
}