import express from "express";
const eventRouter = express.Router();
import { Event } from "../models/event.js"
import { Registration } from "../models/registration.js"
import { authMiddleware, optionalAuth } from "../middlewares/authMiddleware.js";
import { createEventSchema, updateStatusSchema } from "../validators/eventValidator.js";
import { registerForEventSchema, registrationDeleteSchema } from "../validators/registrationValidator.js"
import { createEvent, getAllEvents, getAllEventsByUser, getEventBySlug, isValidObjectId, eventHostValidation, eventUpdate, deleteEvent, publishEvent } from "../controllers/eventController.js"

eventRouter.post("/", authMiddleware, async function (req, res) {
    const eventCreateResult = createEventSchema.safeParse(req.body)

    const hostId = req.user.id
    const hostName = req.user.name;
    const hostEmail = req.user.email;

    if (!eventCreateResult.success) {
        return res.status(400).json({
            message: "event validation failed",
            errors: eventCreateResult.error.issues
        })
    }
    try {
        const registeredEvent = await createEvent(eventCreateResult.data, hostId, hostName, hostEmail)
        return res.status(201).json({
            message: registeredEvent.message,
            eventName: registeredEvent.eventName,
            hostName: hostName,
            hostEmail: hostEmail
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "this event already exists"
            })
        }
        return res.status(500).json({
            message: "server error"
        })
    }
})
eventRouter.get("/", async function (req, res) {
    try {
        const events = await getAllEvents();

        return res.status(200).json({
            message: "event details fetched",
            eventdetails: events
        })
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
})
eventRouter.get("/my/events", authMiddleware, async function (req, res) {
    const hostId = req.user.id
    const hostName = req.user.name;
    try {
        const eventsByUser = await getAllEventsByUser(hostId);
        return res.status(200).json({
            message: "event details of a user fetched",
            createdBy: hostName,
            eventdetails: eventsByUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }

})
eventRouter.get("/:slug", async function (req, res) {
    const req_slug = req.params.slug;
    try {
        const req_slug_event = await getEventBySlug(req_slug);
        if (!req_slug_event) {
            return res.status(404).json({
                message: "event not found"
            })
        }
        return res.status(200).json({
            message: "found the event with the requested slug",
            req_slug_event: req_slug_event.eventData,
            seatsLeft:req_slug_event.seatsLeft
        })
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
})
eventRouter.put("/:id", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const eventId = req.params.id;
    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" })
        }
        else {
            const updatedData = createEventSchema.safeParse(req.body);

            if (!updatedData.success) {
                return res.status(400).json({
                    message: "event validation failed",
                    errors: updatedData.error.issues,
                });
            }
            const isHost = await eventHostValidation(hostId, eventId)
            if (isHost.ok === false) {
                return res.status(403).json({ message: "Not authorized" });
            }
            else {
                const updated = await eventUpdate(updatedData.data, eventId)
                return res.status(200).json({
                    message: updated.message
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }







})
eventRouter.delete("/:id", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const eventId = req.params.id;
    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" })
        }
        else {
            const isHost = await eventHostValidation(hostId, eventId);
            if (isHost.ok === false) {
                return res.status(403).json({ message: "Not authorized" });
            }
            else {
                const deleted = await deleteEvent(eventId);
                return res.status(200).json({ message: "Event deleted" })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }

})
eventRouter.patch("/:id/status", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const eventId = req.params.id;

    const result = updateStatusSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: result.error.issues,
        });
    }
    const status = result.data.status;

    try {
        if (!isValidObjectId(eventId)) {
            return res.status(404).json({ message: "invalid event id" })
        }
        else {
            const isHost = await eventHostValidation(hostId, eventId);
            if (isHost.ok === false) {
                return res.status(403).json({ message: "Not authorized" });
            }
            else {
                const publishDone = await publishEvent(eventId, status);
                return res.status(200).json({ message: "event published" })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
})
eventRouter.post("/:id/register", optionalAuth, async function (req, res) {
    const registerEventResult = registerForEventSchema.safeParse(req.body);
    const eventId = req.params.id;

    let userId = null
    if (req.user) {
        userId = req.user.id

    }
    if (!registerEventResult.success) {
        return res.status(400).json({
            message: "event register validation failed",
            errors: registerEventResult.error.issues
        })
    }
    const result = registerEventResult.data

    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" })
        }

        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(404).json({ message: "event not found" })
        }
        if (event.status !== "published") {
            return res.status(400).json({ message: "registration not open" })
        }

        if (event.registrationDeadline) {
            if (new Date() > event.registrationDeadline) {
                return res.status(400).json({ message: "registrations closed" })
            }
        }
        let status = ""
        const seatsTaken = await Registration.countDocuments({
            event: eventId,
            status: { $in: ["approved", "pending"] }
        })
        if (seatsTaken >= event.capacity) {
            status = "waitlisted"
        }
        else if (event.registrationMode === "auto") {
            status = "approved"
        }
        else {
            status = "pending"
        }
        const existingRegistration = await Registration.findOne({
            event: eventId,
            email: result.email.toLowerCase()
        })
        if (existingRegistration) {

            if (existingRegistration.status !== "cancelled") {
                return res.status(400).json({ message: "event already registered" })
            }
            const updated = await Registration.findByIdAndUpdate(
                existingRegistration._id,
                {
                    name: result.name,
                    phone: result.phone,
                    organization: result.organization,
                    status: status,
                    ...(userId && { userId }),
                },
                { new: true }
            )
            return res.status(201).json({
                message: "registration successful",
                status: updated.status,
                registrationId: updated._id,
            })

        }


        const registrationData = {
            event: eventId,
            name: result.name,
            email: result.email,
            phone: result.phone,
            organization: result.organization,
            status: status
        }
        if (userId) {
            registrationData.userId = userId;
        }
        const newRegistration = await Registration.create(registrationData);
        return res.status(201).json({
            message: "registration successful",
            status: newRegistration.status,
            registrationId: newRegistration._id
        })


    } catch (error) {
        if (error.code === 11000) {
            console.log(error);

            return res.status(400).json({
                message: "already registered for this event"
            })
        }
        return res.status(500).json({
            message: "server error"
        })
    }
})

eventRouter.get("/:id/registrations", authMiddleware, async function (req, res) {
    const eventId = req.params.id;
    const hostId = req.user.id;
    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" })
        }
        const isHost = await eventHostValidation(hostId, eventId);
        if (isHost.ok === false) {
            return res.status(403).json({ message: "Not authorized" });
        }
        else {
            const registrations = await Registration.find({ event: eventId })
            return res.status(200).json({
                message: `found the registrations `,
                registration: registrations
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
})

eventRouter.delete("/registrations/:id", async function (req, res) {
    const registrationDeleteResult = registrationDeleteSchema.safeParse(req.body);
    const registrationId = req.params.id;

    if (!isValidObjectId(registrationId)) {
        return res.status(400).json({ message: "invalid registration id" })
    }

    if (!registrationDeleteResult.success) {
        return res.status(400).json({
            message: "event delete validation failed",
            errors: registrationDeleteResult.error.issues
        })
    }
    const result = registrationDeleteResult.data

    try {
        const registrationAvailable = await Registration.findById(registrationId)
        if (!registrationAvailable) {
            return res.status(404).json({ message: "registration not there" })
        }
        const isSame = await Registration.findOne({ _id: registrationId, email: result.email.toLowerCase() })
        if (!isSame) {
            return res.status(400).json({
                message: "invalid email id"
            })
        }
        if (isSame.status === "cancelled") {
            return res.status(400).json({
                message: "already cancelled"
            })
        }
        const updateCancel = await Registration.findByIdAndUpdate(registrationId, { status: "cancelled" }, { new: true })
        return res.status(200).json({ message: "registration cancelled" })
    }
    catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
})
export { eventRouter }