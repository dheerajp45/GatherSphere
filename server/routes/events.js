import express from "express";
import { authMiddleware, optionalAuth } from "../middlewares/authMiddleware.js";
import { createEventSchema, updateStatusSchema } from "../validators/eventValidator.js";
import {
    createEvent,
    getAllEvents,
    getAllEventsByUser,
    getEventBySlug,
    eventUpdate,
    deleteEvent,
    updateEventStatus,
} from "../controllers/eventController.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { eventHostValidation } from "../utils/eventHostValidation.js";

const eventRouter = express.Router();

eventRouter.post("/", authMiddleware, async function (req, res) {
    const eventCreateResult = createEventSchema.safeParse(req.body);
    const hostId = req.user.id;
    const hostName = req.user.name;
    const hostEmail = req.user.email;

    if (!eventCreateResult.success) {
        return res.status(400).json({
            message: "event validation failed",
            errors: eventCreateResult.error.issues,
        });
    }

    try {
        const registeredEvent = await createEvent(eventCreateResult.data, hostId);
        return res.status(201).json({
            message: registeredEvent.message,
            eventName: registeredEvent.eventName,
            hostName,
            hostEmail,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "this event already exists" });
        }
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.get("/", async function (req, res) {
    try {
        const events = await getAllEvents();
        return res.status(200).json({
            message: "event details fetched",
            eventdetails: events,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.get("/my/events", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const hostName = req.user.name;

    try {
        const eventsByUser = await getAllEventsByUser(hostId);
        return res.status(200).json({
            message: "event details of a user fetched",
            createdBy: hostName,
            eventdetails: eventsByUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.get("/:slug", async function (req, res) {
    try {
        const req_slug_event = await getEventBySlug(req.params.slug);
        if (!req_slug_event) {
            return res.status(404).json({ message: "event not found" });
        }
        return res.status(200).json({
            message: "found the event with the requested slug",
            req_slug_event: req_slug_event.eventData,
            seatsLeft: req_slug_event.seatsLeft,
        });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.put("/:id", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const eventId = req.params.id;

    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" });
        }

        const updatedData = createEventSchema.safeParse(req.body);
        if (!updatedData.success) {
            return res.status(400).json({
                message: "event validation failed",
                errors: updatedData.error.issues,
            });
        }

        const isHost = await eventHostValidation(hostId, eventId);
        if (!isHost.ok) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updated = await eventUpdate(updatedData.data, eventId);
        return res.status(200).json({ message: updated.message });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.delete("/:id", authMiddleware, async function (req, res) {
    const hostId = req.user.id;
    const eventId = req.params.id;

    try {
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ message: "invalid event id" });
        }

        const isHost = await eventHostValidation(hostId, eventId);
        if (!isHost.ok) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await deleteEvent(eventId);
        return res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

eventRouter.patch("/:id/status", authMiddleware, async function (req, res) {
    const result = updateStatusSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "validation failed",
            errors: result.error.issues,
        });
    }

    try {
        const response = await updateEventStatus(req.user.id, req.params.id, result.data.status);
        return res.status(response.status).json({ message: response.message });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});

export { eventRouter };
