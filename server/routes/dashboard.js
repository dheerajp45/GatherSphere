import express from "express";
const dashboardRouter = express.Router();
import{eventHostedByUser,upcomingEvents,totalRegistrationsDone,getMyRegistrations} from "../controllers/dashboardController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
dashboardRouter.get("/stats",authMiddleware,async function(req,res){
    const hostId = req.user.id;
    try {
        const eventHosted = await eventHostedByUser(hostId);
        const upcoming=await upcomingEvents(hostId)
        const totalRegistrations =await totalRegistrationsDone(hostId);
        return   res.json({
            eventsHosted:eventHosted,
            upcomingEvents:upcoming,
            totalRegistrations:totalRegistrations,
        })
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
})
dashboardRouter.get("/myregistrations",authMiddleware,async function(req,res){
    const hostId = req.user.id;

try{
    const myRegistrations = await getMyRegistrations(hostId);
return res.json({
    myRegistrations:myRegistrations
})
}catch (error) {
    return res.status(500).json({message:"server error"})
}
})

export{dashboardRouter}