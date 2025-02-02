"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {

  const [visibleAnim, setVisibleAnim] = useState(true);
  const [visiblePrevReport, setVisiblePrevReport] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("")
  const [campaignLocation, setCampaignLocation] = useState("")
  const [campaignOutcome, setCampaignOutcome] = useState("")
  const [campaignExpense, setCampaignExpense] = useState("")
  const notFilledMessage = "not filled by user"

  type prevReportType = {
    date: string;
    time: string;
    campaignName: string;
    campaignLocation: string;
    campaignOutcome: string;
    campaignExpense: string;
    fileUrl: string;
  }[];
  
  const [prevReport, setPrevReport] = useState<prevReportType>([]);
  
  type dataType = {
    userName: string,
    email: string,
  }
  const [data, setData] = useState<dataType>({
    userName: "",
    email: "",
  });

  useEffect(()=>{
   async function getUserDetail(){
    try {
      const res = await axios.get("/api/users/me")
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
   }
   getUserDetail()
  },[])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview
  };

  const handleUpload = async () => {
    if (!campaignOutcome) return toast("Please write a description");
  
    setLoading(true);
  
    try {
      let imageUrl = null;
  
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const res = await axios.post("api/upload", formData);
        console.log(res.data.imgUrl);
        imageUrl = res.data.imgUrl; // Get the uploaded image URL      
      }
      console.log(imageUrl);
      

      const name = data.userName
      const email = data.email
      const date = new Date(Date.now()).toISOString().split("T")[0]
      const time = new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      console.log(time);
      console.log(date);
      
      
      const response = await axios.post("/api/report/createReport", {name, email, time, date, campaignName, campaignLocation, campaignOutcome, campaignExpense, imageUrl});
      toast("Report Submitted Successfully!");
      console.log(response.data);
      setCampaignExpense("")
      setCampaignLocation("")
      setCampaignName("")
      setCampaignOutcome("")
      setImage(null)
      setPreview(null)

    } catch (error) {
      toast("Upload Failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrevReports = async() => {
    try {
      const email = data.email;
      const res = await axios.post("/api/report/getReport", {email});
      console.log(res.data.report);
      setPrevReport(res.data.report)
      console.log(prevReport);
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

  //bg-[#ffe0e0]
  return (
   <div className="bg-white pt-14 w-full">
    <div className="w-full ">
    <h1 className="text-6xl font-bold pt-20 px-5 text-black">Welcome Back <span className="text-blue-500">{data.userName}</span></h1>
    <h1 className="text-4xl font-bold pt-5 px-5 text-black">Submit Todays Report Here</h1>
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="ml-5 mt-2 text-blue-500 w-60 bg-zinc-50 hover:bg-zinc-50 hover:shadow-md border-[1px]" variant="outline">Create Report</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-[650px] w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create Campaign Report</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <div className="">
          <div className=" backdrop-blur-sm p-4 max-w-md">
            <Input
            placeholder="Campaign Name"
            className="bg-white mb-2"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            />
            <Input
            placeholder="Campaign Location"
            className="bg-white mb-2"
            value={campaignLocation}
            onChange={(e) => setCampaignLocation(e.target.value)}
            />
            <Textarea
              className="bg-white mb-2"
              placeholder="Campaign Outcome *"
              value={campaignOutcome}
              onChange={(e) => setCampaignOutcome(e.target.value)}
            ></Textarea>
            <Input
            placeholder="Campaign Expense"
            className="bg-white mb-2"
            value={campaignExpense}
            onChange={(e) => setCampaignExpense(e.target.value)}
            />
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
              // onChange={(e) => setFile(e.target.files[0])}
            />
           <div className="w-40 h-40 rounded-lg bg-slate-50 mt-5">
           {preview && 
            <Image 
            src={preview} 
            alt="Preview" 
            className="w-40 mt-5 h-40 object-cover rounded-lg mb-3" 
            width={80}
            height={80}
            unoptimized
            />}
           </div>
        </div>
          </div>
          <DrawerFooter>
          <Button onClick={handleUpload} disabled={loading} className="mt-3 w-full ">
          {loading ? "Uploading..." : "Upload"}
          </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>


    <Button onClick={()=> { setVisibleAnim(false) ; setVisiblePrevReport(true) ; fetchPrevReports() }} className="ml-5 mt-2 text-blue-500 w-60 bg-zinc-50 hover:bg-zinc-50 hover:shadow-md border-[1px]">Previous Reports</Button>
    </div>
    {visibleAnim && (
      <div className="w-full mt-10 h-96 ">
      <video className="" autoPlay loop muted src="/videos/anime.mp4"></video>
    </div>
    )}
  
   {visiblePrevReport && (
    <div className="w-full mt-10 py-10 bg-zinc-100 grid sm:grid-cols-3 gap-3 items-center justify-center  ">
    {
      prevReport.map((rep, index)=>(
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
            <div className="mt-3">
              <p className="text-gray-500 text-sm">📅 {rep.date} | ⏰ {rep.time}</p>
              {/* <p className="text-gray-600 mt-1 w-80 bg-orange-600">file link - {rep.fileUrl}</p> */}
              <h3 className="text-sm text-gray-800 mt-1">Campaign Name</h3>
              <p className="text-gray-600 rounded-md p-2 bg-zinc-100 mt-1">{rep.campaignName ? rep.campaignName : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
              <h3 className="text-sm text-gray-800 mt-1">Campaign Location</h3>
              <p className="text-gray-600 rounded-md p-2 bg-zinc-100 mt-1">{rep.campaignLocation ? rep.campaignLocation : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
              <h3 className="text-sm text-gray-800 mt-1">Campaign Outcome</h3>
              <p className="text-gray-600 rounded-md p-2 bg-zinc-100 mt-1">{rep.campaignOutcome ? rep.campaignOutcome : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
              <h3 className="text-sm text-gray-800 mt-1">Campaign Expense</h3>
              <p className="text-gray-600 rounded-md p-2 bg-zinc-100 mt-1">{rep.campaignExpense ? rep.campaignExpense : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
            </div>
          </div>
        </div>
      ))
    }
    </div>
   )}
   <Toaster position="top-center" />
   </div>
  );
}
