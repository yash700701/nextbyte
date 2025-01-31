import mongoose from "mongoose";
// import { type } from "os";
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    jobProfile: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    imgUrl: {
        type: String,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

})

const Users = mongoose.models.users || mongoose.model("users", userSchema);
export default Users