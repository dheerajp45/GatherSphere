import express from "express";
const dashboardRouter = express.Router();

dashboardRouter.get("/stats", function(req,res){
    const eventsHosted =0;
    const upcomingEvents=0;
    const totalRegistrations =0;
    res.json({
        eventsHosted:eventsHosted,
        upcomingEvents:upcomingEvents,
        totalRegistrations:totalRegistrations
    })
})

export{dashboardRouter}