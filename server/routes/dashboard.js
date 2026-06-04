import express from "express";
const dashboardRouter = express.Router();
import{eventHostedByUser,upcomingEvents} from "../controllers/dashboardController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
dashboardRouter.get("/stats",authMiddleware,async function(req,res){
    const hostId = req.user.id;
    try {
        const eventHosted = await eventHostedByUser(hostId);
        const upcoming=await upcomingEvents(hostId)
        const totalRegistrations =0;
        return   res.json({
            eventsHosted:eventHosted,
            upcomingEvents:upcoming,
            totalRegistrations:totalRegistrations
        })
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }

  
})

export{dashboardRouter}