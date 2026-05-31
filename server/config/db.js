import mongoose, { connect } from "mongoose"
import {MONGODB_URI} from "./env.js"
async function connectDB() {
    try {
        if(!MONGODB_URI){
            console.error("there is no mongo url available")
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log("mongodb connected successfully");
        
    }
    catch (err) {
        console.error("failed to start the server:",err.message)
        process.exit(1);
    
}}

export {connectDB}