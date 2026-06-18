import express from "express";
import { authMiddleware, optionalAuth } from "../middlewares/authMiddleware.js";
import { registerForEventSchema, registrationDeleteSchema,attendanceSchema ,checkInSchema} from "../validators/registrationValidator.js";
import {
    registerForEvent,
    getEventRegistrations,
    cancelRegistration,
    approveRegistration,
    rejectRegistration,markAttendance,getTicketByToken,getTicketById,checkInByToken
} from "../controllers/registrationController.js";

const registrationRouter = express.Router();

registrationRouter.post("/events/:eventId/register", optionalAuth, async (req, res) => {
    const registerEventResult = registerForEventSchema.safeParse(req.body);

    if (!registerEventResult.success) {
        return res.status(400).json({
            message: "event register validation failed",
            errors: registerEventResult.error.issues,
        });
    }

    const userId = req.user?.id ?? null;
    const userMail = req.user?.email??null;

    try {
        const result = await registerForEvent(req.params.eventId, registerEventResult.data, userId,userMail);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(result.status).json({
            message: result.message,
            status: result.statusValue,
            registrationId: result.registrationId,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "already registered for this event" });
        }
        return res.status(500).json({ message: "server error" });
    }
});

registrationRouter.get("/events/:eventId", authMiddleware, async (req, res) => {
    try {
        const result = await getEventRegistrations(req.params.eventId, req.user.id);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(result.status).json({
            message: result.message,
            registration: result.registrations,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

registrationRouter.delete("/:id", async (req, res) => {
    const registrationDeleteResult = registrationDeleteSchema.safeParse(req.body);

    if (!registrationDeleteResult.success) {
        return res.status(400).json({
            message: "event delete validation failed",
            errors: registrationDeleteResult.error.issues,
        });
    }

    try {
        const result = await cancelRegistration(req.params.id, registrationDeleteResult.data.email);

        if (!result.ok) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

registrationRouter.patch("/:id/approve", authMiddleware, async (req, res) => {
    try {
        const result = await approveRegistration(req.params.id, req.user.id);
        return res.status(result.status).json({
            message: result.message,
            Registration: result.updated,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

registrationRouter.patch("/:id/reject", authMiddleware, async (req, res) => {
    try {
        const result = await rejectRegistration(req.params.id, req.user.id);
        return res.status(result.status).json({
            message: result.message,
            Registration: result.updated,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});
registrationRouter.patch("/:id/attendance",authMiddleware, async (req, res) =>{
    const parsed = attendanceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "validation failed", errors: parsed.error.issues });
  }
    try {
        const result = await  markAttendance(req.params.id, req.user.id,parsed.data.attendanceStatus);
        if (!result.ok) {
            return res.status(result.status).json({ message: result.message });
          }
        return res.status(result.status).json({
            message: result.message,
            Registration: result.updated,
        });
    } catch (error) {

        
        return res.status(500).json({ message: "server error" });
    }
})

registrationRouter.get("/ticket/:ticketToken", async function(req,res){
    const tickenToken= req.params.ticketToken
try{
    const result = await getTicketByToken(tickenToken)
    if(!result.ok){
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(result.status).json({
        message: result.message,
        ticketToken:result.ticketToken,
        name:result.name,
        checkedInAt:result.checkedInAt,
        eventTitle:result.eventTitle
    });
}catch(error){
    return res.status(500).json({ message: "server error" });
}
} )

registrationRouter.get("/:id/ticket",authMiddleware,async function(req,res){
const registrationId = req.params.id;
const userId= req.user.id
try{
    const result = await getTicketById(registrationId,userId)
    if(!result.ok){
        return res.status(result.status).json({ message: result.message });
    }
    return res.status(result.status).json({
        message: result.message,
        ticketToken:result.ticketToken,
        name:result.name,
        checkedInAt:result.checkedInAt,
        eventTitle:result.eventTitle
    });
}catch(error){
    console.log(error);
    
    return res.status(500).json({ message: "server error" });
}
})

registrationRouter.post("/check-in",authMiddleware,async function (req,res){
    const checkInResult = checkInSchema.safeParse(req.body);
    if (!checkInResult.success) {
        return res.status(400).json({
            message: "event register validation failed",
            errors: checkInResult.error.issues,
        });
    }try {
        const result=await checkInByToken(checkInResult.data.ticketToken,req.user.id)
        if (!result.ok) {
            return res.status(result.status).json({ message: result.message });
          }
        return res.status(result.status).json({
            message: result.message,
            eventTitle: result.eventTitle
        });
    } catch (error) {
        
        
        return res.status(500).json({ message: "server error" });

    }
    

})

export { registrationRouter };
