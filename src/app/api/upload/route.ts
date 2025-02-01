import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


type UploadResponse = 
  { success: true; result?: UploadApiResponse } | 
  { success: false; error: UploadApiErrorResponse };


  const uploadToCloudinary = (
    fileUri: string, fileName: string
  ): Promise<UploadResponse> => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(fileUri, {
          invalidate: true,
          resource_type: "auto",
          filename_override: fileName,
          folder: "uploads",
          use_filename: true,
        })
        .then((result) => resolve({ success: true, result }))
        .catch((error) => resolve({ success: false, error })); // ✅ FIXED
    });
  };

export async function POST(request: NextRequest) {
  try {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      const fileBuffer = await file.arrayBuffer();

      const mimeType = file.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");

      // this will be used to upload the file
      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

      const res = await uploadToCloudinary(fileUri, file.name);

      if (res.success && res.result) {
        return NextResponse.json({ 
            message: "success", imgUrl: res.result.secure_url 
        }); 
      } else return NextResponse.json({ message: "failure" });
    }

   catch (error: unknown) { 
      console.error("Server error:", error); // ✅ Log any unexpected errors
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
