import mongoose from "mongoose";
import 'dotenv/config.js'
const dbConnection=async()=>{
    try{
     const db=await mongoose.connect(process.env.DB)
     if(db){
        console.log("database connect sucessful")
     }else{
        console.log("databse connect failed")
     }
    }catch(err){
        throw new Error(err)
    }
}
export default dbConnection;