"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import userImg from '@/image/user.png'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type PageProps = {
  params: Promise<{ id: string }>;
};

function Page({params}: PageProps) {
    const resolvedParams = React.use(params); // Unwrap params
    const id = resolvedParams.id; // Now safe to access
    const [visible, setVisible] = useState(false);

    type userType = {
        _id: string,
        email: string,
        userName: string,
        jobProfile: string,
        imgUrl: string,

    }
    const [user, setUser] = useState<userType>()

    type reportsType = {
        userName: string,
        time: string,
        date: string,
        campaignName: string,
        campaignLocation: string,
        campaignOutcome: string,
        campaignExpense: string,
        fileUrl: string,
    }[]
    const [reports, setReports] = useState<reportsType>([]);

    useEffect(()=>{
      async function getDetail() {
        try {
          const res = await axios.post("/api/users/getUser", {id})
          console.log(res.data.users);
          setUser(res.data.users);
          console.log("Component re-rendered 2")
        } catch (error) {
          console.log(error);
        }
      }
      getDetail()
    },[id])

    async function handleDeleteUser(){

        try {
          const id = user?._id; 
          toast("Account Deleted")
          await axios.post("/api/users/delete", {id})
        } catch (error) {
          console.log(error);
        }
    }
    async function handleDeleteReports(){
        try {
          const email = user?.email;
          await axios.post("/api/report/delete", {email})
        } catch (error) {
          console.log(error);
        }
    }

    async function getReports() {
      try {
        
        const email = user?.email;
        const res = await axios.post("/api/report/getReport", {email})
        setReports(res.data.report)
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <>
    <div className="flex justify-center items-center mt-14 p-5 bg-gray-100">
    <div className="bg-white p-6 mt-10 rounded-2xl shadow-lg max-w-sm w-full text-center">
      <Image
        src={user?.imgUrl || userImg}
        alt={"user"}
        width={10}
        height={10}
        className="w-24 h-24 rounded-full mx-auto object-cover shadow-md"
        unoptimized
      />
      <div className='h-20 w-full'>
      <h1 className="text-xl font-bold mt-4">{user?.userName}</h1>
      <p className="text-gray-600">{user?.jobProfile}</p>
      <p className="text-gray-500 mt-2">{user?.email}</p>
      </div>
      <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-300" variant="outline">Delete User</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete employee
            account and remove their all reports from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>{handleDeleteUser() ; handleDeleteReports()}} className='bg-red-100 text-red-800'>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
      <Button
        onClick={()=>{setVisible((prev)=> !prev) ; getReports()}}
        className="mt-2 w-full text-white py-2 rounded-lg transition-all duration-300"
      >
        {visible ? "Hide" : "View Submitted Reports"}
      </Button>
    </div>
  </div>
    
  {visible && (
    <div className='h-80 w-full'>
         <div className="w-full py-10 bg-zinc-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center justify-center  ">
            {
            reports.map((rep, index)=>(
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
    </div>
  )}
  <Toaster position="top-center" />
    </>
  )
}

export default Page