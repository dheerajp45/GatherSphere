import express from "express";
const eventRouter = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createEventSchema,updateStatusSchema } from "../validators/eventValidator.js";
import {createEvent,getAllEvents,getAllEventsByUser,getEventBySlug,isValidObjectId,eventHostValidation,eventUpdate,deleteEvent,publishEvent} from "../controllers/eventController.js"



eventRouter.post("/",authMiddleware,async function (req,res) {
    const eventCreateResult = createEventSchema.safeParse(req.body)
    const hostId = req.user.id
    const hostName = req.user.name;
    const hostEmail =  req.user.email;
    
    if(!eventCreateResult.success){
        return res.status(400).json({
            message:"event validation failed",
            errors:eventCreateResult.error.issues
        })
    }
    try {
    const regsiteredEvent = await createEvent(eventCreateResult.data,hostId,hostName,hostEmail)
    return res.status(201).json({
        message:regsiteredEvent.message,
        eventName:regsiteredEvent.eventName,
        hostName:hostName,
        hostEmail:hostEmail
    })
        
    } catch (error) {
        if(error.code ===11000){
            return res.status(400).json({
                message:"this event already exists"
            })
        }
        return res.status(500).json({
            message:"server error"
        })
    }
})
eventRouter.get("/",async function (req,res) {
    try {
        const events = await getAllEvents();
        
        return res.status(200).json({
            message:"event details fetched",
            eventdetails:events
        })
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })}
})

eventRouter.get("/my/events",authMiddleware,async function (req,res) {
    const hostId = req.user.id
    const hostName=req.user.name;
    try {
        const eventsByUser =await  getAllEventsByUser(hostId);
        return res.status(200).json({
            message:"event details of a user fetched",
            createdBy:hostName,
            eventdetails:eventsByUser,
        })
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })
    }

})
eventRouter.get("/:slug",async function (req,res) {
    const req_slug = req.params.slug;
    try {
        const req_slug_event = await getEventBySlug(req_slug);
        if(!req_slug_event){
            return res.status(404).json({
                message:"event not found"
            })
        }
        return res.status(200).json({
            message:"found the event with the requested slug",
            req_slug_event:req_slug_event
        })
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })
    }
})
eventRouter.put("/:id",authMiddleware,async function (req,res) {
    const hostId= req.user.id;
    const eventId = req.params.id;
    try {
        if(!isValidObjectId(eventId)){
            return res.status(400).json({message:"invalid event id"})
        }
       else{
            const updatedData = createEventSchema.safeParse(req.body);
        
            if (!updatedData.success) {
              return res.status(400).json({
                message: "event validation failed",
                errors: updatedData.error.issues,
              });
            }
            const isHost = await eventHostValidation(hostId,eventId)
            if(isHost.ok===false){
                return res.status(403).json({ message: "Not authorized" });
            }
            else{
                const updated = await eventUpdate(updatedData.data,eventId)
                return res.status(200).json({
                    message: updated.message
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })
    }

   




    
})
eventRouter.delete("/:id",authMiddleware,async function (req,res) {
    const hostId = req.user.id;
    const eventId = req.params.id;
    try {
        if(!isValidObjectId(eventId)){
            return res.status(400).json({message:"invalid event id"})
        }
        else{
            const isHost =  await eventHostValidation(hostId,eventId);
            if(isHost.ok===false){
                return res.status(403).json({ message: "Not authorized" });
            }
            else{
                const deleted = await deleteEvent(eventId);
                return res.status(200).json({message: "Event deleted"})
            }
        }
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })
    }

})
eventRouter.patch("/:id/status",authMiddleware,async function (req,res) {
    const hostId = req.user.id;
    const eventId = req.params.id;
   
    const result = updateStatusSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
          message: "validation failed",
          errors: result.error.issues,
        });
      }
    const status =  result.data.status;

    try {
        if(!isValidObjectId(eventId)){
            return res.status(404).json({message:"invalid event id"})
        }
        else{
            const isHost =  await eventHostValidation(hostId,eventId);
            if(isHost.ok===false){
                return res.status(403).json({ message: "Not authorized" });
            }
            else{
                const publishDone = await publishEvent(eventId,status);
                return res.status(200).json({message:"event published"})
            }
        }
    } catch (error) {
        return res.status(500).json({
            message:"server error"
    })
    }
})
export{eventRouter}