import cors from "cors"
import express from "express"
import { PORT } from "./config/env.js";
import {connectDB} from "./config/db.js"
const app = express();
app.use(cors({origin:"http://localhost:5173"}))

import { authRouter } from "./routes/auth.js";
import { eventRouter} from "./routes/events.js";
import { dashboardRouter } from "./routes/dashboard.js";
app.use(express.json());
app.use("/api/auth",authRouter)
app.use("/api/events",eventRouter)
app.use("/api/dashboard",dashboardRouter)
app.get("/",(req,res)=>{
res.send("hi hello server started")
})

app.listen(PORT,async ()=>{
    console.log(`server running on http://localhost:${PORT}`);
    
    await connectDB();

})