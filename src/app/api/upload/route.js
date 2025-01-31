import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";


connect();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// // Multer Storage Setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

export const POST = async(req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    // const newImage = new Reports({ fileUrl: result.secure_url });
    // await newImage.save();

    return NextResponse.json({ message: "Image uploaded successfully", imageUrl: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
