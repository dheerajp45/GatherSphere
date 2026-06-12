import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { approveRegistration, rejectRegistration } from "../controllers/registrationController.js";
import { isValidObjectId } from "../controllers/eventController.js";

const registrationRouter = express.Router();


registrationRouter.patch("/:id/approve", authMiddleware, async (req, res) => {

    const registrationId = req.params.id;
    const hostId = req.user.id;
    try {
        const result = await approveRegistration(registrationId, hostId)
        if(result.ok){
            return res.status(result.status).json({
                message:result.message,
                Registration:result.updated
            })
        }
        if(!result.ok){
            return res.status(result.status).json({
                message:result.message,
                Registration:result.updated
            })}
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "server error"
        })
    }
  });

  registrationRouter.patch("/:id/reject", authMiddleware, async (req, res) => {
    const registrationId = req.params.id;
    const hostId = req.user.id;
    try {
        const result = await rejectRegistration(registrationId, hostId)
        if(result.ok){
            return res.status(result.status).json({
                message:result.message,
                Registration:result.updated
            })
        }
        if(!result.ok){
            return res.status(result.status).json({
                message:result.message,
                Registration:result.updated
            })}
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
  });


  export {registrationRouter }