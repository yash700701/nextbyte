import mongoose from "mongoose";

export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on("connected", ()=>{
            console.log("mongo connected successfully");
        })

        connection.on("error", (err)=>{
            console.log(`error occur ${err}`);
            process.exit();
        })
    } catch (error) {
        console.log("error in connecting database");
        console.log(error);
    }
}