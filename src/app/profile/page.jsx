"use client"

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import profilePic from "@/image/user.png"
import { Button } from "@/components/ui/button"
 
export default function profile(){
    const router = useRouter();
    const [data, setData] = useState({}) 
    const userImage = data.imgUrl
        
    const logout = async()=>{
        if(data.userName){
            try {
                await axios.get("/api/users/logout")
                toast.success("logout successfull")
                router.replace("/login")
            } catch (error) {
                console.log(error.message);
                toast.error(error.message)
            }
        }else{
            router.replace("/login")
        }
    }

    // const update = async()=>{
       
    //         try {
    //             await axios.post("/api/users/update", updatedData)
    //             toast.success("update successfull")
    //         } catch (error) {
    //             console.log(error.message);
    //             toast.error(error.message)
    //         }
       
    // }

    
    useEffect(()=>{
        const getUserDetail = async()=>{
            const res = await axios.get('/api/users/me');
            console.log(res.data.data);
            setData(res.data.data || "");
            console.log("Component re-rendered 1")
        }
        getUserDetail();
    },[])


    return(
        <div className="h-screen text-white w-full bg-zinc-900">
            <div className="items-center p-3">
            <div className="w-full h-[500px] mt-14 rounded-md shadow-xl bg-zinc-800 ">
                <div className="flex items-end ">
                <Image
                    className="h-20 w-20 mt-10 ml-10 rounded-lg object-cover"
                    src={userImage || profilePic}
                    alt="User Image"
                    width={80}
                    height={80}
                    unoptimized
                    />
                    <div className="ml-8">
                        <h1>{data.userName}</h1>
                        <h1>{data.jobProfile}</h1>
                        <h1>{data.email}</h1>
                    </div>
                </div>
                <div className="w-full mt-5">
                <Button  className="w-60 mx-8 bg-black hover:text-[#588157]">Edit Profile</Button>
                <Button onClick={logout} className="w-60 mt-2 mx-8 bg-red-400  hover:text-red-800">{data.userName ? "Logout" : "Login"}</Button>
                </div>
                <div className="h-80  mt-5">
                    
                </div>
            </div>
            </div>
        </div>
    )
}