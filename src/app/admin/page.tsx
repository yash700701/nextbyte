"use client"

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import userPic from '@/image/user.png'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


function Page() {
    const [todaysReportVisible, setTodaysReportVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [notAdmin, setNotAdmin] = useState(true);
    const [loading, setLoading] = useState(true);
    const [inputKey, setInputKey] = useState("");

    type todaysReportsType = {
        fileUrl: string,
        userName: string,
        date: string,
        time: string,
        campaignName: string,
        campaignLocation: string,
        campaignOutcome: string,
        campaignExpense: string,
    }[]
    const [todaysReports, setTodaysReports] = useState<todaysReportsType>([]);

    type profilesType = {
        _id: string,
        imgUrl: string,
        userName: string,
        jobProfile: string,
    }[];
    const [profiles, setProfiles] = useState<profilesType>([])

    const router = useRouter();

    useEffect(()=>{
        async function getMe() {
            try {
                const res = await axios.get("/api/users/me")
                setIsAdmin(res.data.data.isAdmin)
                setNotAdmin(res.data.data.isAdmin)
                setLoading(false)
                console.log("Component re-rendered 4")
            } catch (error) {
                console.log(error);
            }
        }
        getMe();
    },[])

    useEffect(()=>{
        async function getProfiles() {
            try {
                const res = await axios.get("/api/users/getUsers")
                setProfiles(res.data.users)
                console.log("Component re-rendered 3")
                
            } catch (error) {
                console.log(error);
            }
        }
        getProfiles();
    },[isAdmin])
    
    function submit(){
       if(inputKey.toLowerCase().trim() === process.env.NEXT_PUBLIC_ADMIN_KEY){
        async function createAdmin() {
            try {
                await axios.post("/api/users/admin", {inputKey})
                setNotAdmin(true)
                setIsAdmin(true)
            } catch (error) {
                console.log(error);
            }
        }
        createAdmin();
       }else if(inputKey === ""){
           toast("please enter admin key");
       }else{
           toast("invalid admin key");
       }
    }

    async function getReports() {
        try {
            const res = await axios.post("/api/report/getTodaysReport")
            setTodaysReports(res.data.report);
        } catch (error) {
            console.log(error);
        }
    }

    type userType = {
        _id: string;
      };
      function goToProfilePage(user: userType) {
        if (!user._id) return alert("User ID not found!"); // Optional safety check
        router.push(`/profile/${user._id}`);
      }

  return (
   <>
    {loading && (
        <div className='w-full mt-28 h-40'>
        <h1 className='text-center'>Loading...</h1>
        </div>
    )}   
    {!notAdmin && (
        <div className='w-full pt-14 flex flex-col items-center text-black h-screen bg-white'>
        <div className='pt-10'>
            <h1 className='text-red-500'>You Are Not Admin</h1>
            <h1>Enter Key To Become Admin</h1>
            <Input type='text' value={inputKey} onChange={(e)=> setInputKey(e.target.value)} className='mt-1 border-black border-[1px] w-80'></Input>
            <Button onClick={submit} className='w-80 mt-2 text-blue-500'>Submit</Button>
        </div>
    </div>
    )}
    {isAdmin && (
        <div className='w-full pt-28 flex flex-col items-center text-black  bg-white'>
        <h1 className='text-2xl font-semibold'>Todays Submissions</h1>
        <Button className='w-40 mt-2' onClick={()=> {setTodaysReportVisible((prev)=> !prev) ; getReports()}}>{todaysReportVisible ? "hide" : "view"}</Button>
        {todaysReportVisible && (
            <div className="w-full mt-5 py-10 bg-zinc-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center justify-center  ">
            {
            todaysReports.map((rep, index)=>(
                <div key={index} className="mx-auto">
                <div className="w-80 bg-white shadow-lg rounded-md  p-4 ">
                    {rep.fileUrl && (
                    <div>
                        <Image
                        src={rep.fileUrl}
                        alt="Task Image"
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-40 object-cover rounded-sm"
                        />
                        <Popover>
                        <PopoverTrigger asChild>
                            <button className='text-xs  rounded-none text-blue-500'>open file</button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 mx-5 ">
                          <div>
                          <Image
                            src={rep.fileUrl}
                            alt="Task Image"
                            width={80}
                            height={80}
                            unoptimized
                            className="w-full object-cover rounded-sm"
                            />
                          </div>
                        </PopoverContent>
                        </Popover>
                    </div>
                    )}
                    <div className="mt-1">
                    <h1 className='mb-2'>Submitted By: <span className='bg-blue-200 px-2 rounded-md'>{rep.userName}</span></h1>
                    <p className="text-gray-500 text-sm">📅 {rep.date} | ⏰ {rep.time}</p>
                    {/* <p className="text-gray-600 mt-1 w-80 bg-orange-600">file link - {rep.fileUrl}</p> */}
                    <h3 className="text-sm text-gray-800 mt-1">Campaign Name</h3>
                    <p className="text-gray-600 bg-zinc-100 rounded-md p-2 mt-1">{rep.campaignName ? rep.campaignName : (<div className='text-red-500'>not filled by user</div>)}</p>
                    <h3 className="text-sm text-gray-800 mt-1">Campaign Location</h3>
                    <p className="text-gray-600 bg-zinc-100 rounded-md p-2 mt-1">{rep.campaignLocation ? rep.campaignLocation : (<div className='text-red-500'>not filled by user</div>)}</p>
                    <h3 className="text-sm text-gray-800 mt-1">Campaign Outcome</h3>
                    <p className="text-gray-600 bg-zinc-100 rounded-md p-2 mt-1">{rep.campaignOutcome ? rep.campaignOutcome : (<div className='text-red-500'>not filled by user</div>)}</p>
                    <h3 className="text-sm text-gray-800 mt-1">Campaign Expense</h3>
                    <p className="text-gray-600 bg-zinc-100 rounded-md p-2 mt-1">{rep.campaignExpense? rep.campaignExpense : (<div className='text-red-500'>not filled by user</div>)}</p>
                    </div>
                </div>
                </div>
            ))
            }
            </div>
        )}
        <div className='w-full mt-10 bg-zinc-100'>
        <h1 className='text-2xl font-semibold text-center pt-5 '>Employee Profiles</h1>
        <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
        {profiles.map((user) =>
        user._id ? ( // Only render users with `_id`
            <div key={user._id} className="mx-auto pb-10">
            <div className="w-40 bg-white shadow-lg rounded-2xl p-5 text-center">
                <Image
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-500"
                src={user.imgUrl || userPic}
                alt={user.userName || "Profile Image"}
                width={96}
                height={96}
                unoptimized
                />
                <h2 className="text-xl font-semibold mt-3">{user.userName}</h2>
                <p className="text-gray-600">{user.jobProfile}</p>
                <Button onClick={() => goToProfilePage(user)} className="mt-2">
                View Profile
                </Button>
            </div>
            </div>
        ) : null
        )}
        </div>
        </div>
        
    </div>
    
    )}
   <Toaster position="top-center" />
   </>
  )
}

export default Page