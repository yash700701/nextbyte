"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import f1 from '@/image/f1.jpg'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function Page() {

    type userType = {
        userName: string;
        email: string;
        password: string;
        jobProfile: string;
      };
      
      const [user, setUser] = useState<userType>({
        userName: "",
        email: "",
        password: "",
        jobProfile: "",
      });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Ensure a file is selected
        if (!file) return;
    
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Show preview
    };

    const [key, setKey] = useState("")
    const [message, setMessage] = useState("")
    const [exist, setExist] = useState("")
    const [loading, setLoading] = useState(false);
    const handleSignup = async()=>{
       if(key === process.env.NEXT_PUBLIC_SIGNUP_KEY){
        try {  
            setExist("")
            setMessage("")          
            setLoading(true)
            console.log(user);
            
            let imageUrl = null;
  
            if (image) {
              const formData = new FormData();
              formData.append("file", image);
              const res = await axios.post("/api/upload", formData);
              imageUrl = res.data.imageUrl; // Get the uploaded image URL      
            }

            const name = user.userName
            const email = user.email
            const password = user.password
            const url = imageUrl
            const job = user.jobProfile
            
            const response = await axios.post("/api/users/signup", {name, email, password, url, job})
            setMessage("an email is sent to your inbox for verification")
            console.log("signup success", response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                setExist("user already exist / internal sever error")
                console.log("signup failed", error.message);
                toast.error(error.response?.data?.error || error.message)
              } else {
                console.error("Unexpected error", error);
              }
        } finally {
            setLoading(false);
        }
       }else if(key === ""){
           toast("please enter secret key")
       }else{
           toast("invalid secret key")
       }
    }

    

    return(
        <div className='bg-white mb-10'>
        <div className='grid lg:grid-cols-2'>
        <div className='mr-2 hidden lg:flex justify-end mt-32 h-screen'>
            <Image
            className=" h-[684px] w-80 right-0 object-cover"
            src={f1}
            alt="Vercel logomark"
            />
        </div>
        <div className='ml-2 flex flex-col text-black items-center lg:items-start mt-32'>
            <h1 className='text-3xl font-semibold mb-10'>Signup</h1>
            <Input
            type='text'
            placeholder='name'
            value={user.userName}
            onChange={(e)=>{setUser({...user, userName: e.target.value})}}
            className='w-80 mb-4  border-[1px] border-black' 
            />
            <Input
            type='email'
            placeholder='email'
            value={user.email}
            onChange={(e)=>{setUser({...user, email: e.target.value})}}
            className='w-80 mb-4  border-[1px] border-black' 
            />
            <Input
            type='text'
            placeholder='job profile'
            value={user.jobProfile}
            onChange={(e)=>{setUser({...user, jobProfile: e.target.value})}}
            className='w-80 mb-4  border-[1px] border-black' 
            />
            <Input
            type='password'
            placeholder='set password'
            value={user.password}
            onChange={(e)=>{setUser({...user, password: e.target.value})}}
            className='w-80 mb-5  border-[1px] border-black' 
            />
            <h1 className='mb-1 w-80 text-zinc-500'>Select profile Image ( not mandatory )</h1>
            
             <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                className=" block w-80 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                // onChange={(e) => setFile(e.target.files[0])}
            />
            <Input
            type='text'
            placeholder='enter secret key'
            value={key}
            onChange={(e)=> setKey(e.target.value)}
            className='w-80 mb-b mt-3  border-[1px] border-black' 
            />
             <div className='bg-zinc-200 rounded-xl h-40 w-40 mt-5'>
             {preview && 
             <Image
             src={preview} 
             alt="Preview" 
             className="w-40 h-40 object-cover rounded-lg mb-3" 
             width={80}
             height={80}
             unoptimized
             />}
             </div>
            <div className='w-80  h-8'>
            <h1 className='text-center text-green-700 text-xs pt-2 ml-1'>{loading ? "": `${message}`}</h1>
            <h1 className='text-center text-red-700 text-xs pt-2 ml-1'>{exist ?`${exist}` : ""}</h1>
            </div>
            <Button onClick={handleSignup} disabled={loading} className='w-80 shadow-md border-[1px] border-black mt-20'>
                {loading ? "Submitting..." : "Submit"}
            </Button>

        </div>
        </div>
        <Toaster position="top-center" />
    </div>
    )
}