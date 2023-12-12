import mongoose from "mongoose";
export const UserSchema=new mongoose.Schema({
    username :{
        type:String,
        require :[true,"Username is required"],
        
    },
    password:{
        type:String,
        require:[true,"password is require"]
    },
    email:{
        type:String,
        require:[true,"Email is require"],
        unique:[true,"Email Exist"]
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    messageExpired:{
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});
const user = mongoose.model("user", UserSchema);
export default  user;