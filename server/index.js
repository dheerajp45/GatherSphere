import express from "express"
import { PORT } from "./config/env.js";
import {connectDB} from "./config/db.js"
const app = express();

app.get("/",(req,res)=>{
res.send("hi hello server started")
})

app.listen(PORT,async ()=>{
    console.log(`server running on http://localhost:${PORT}`);
    
    await connectDB();

})