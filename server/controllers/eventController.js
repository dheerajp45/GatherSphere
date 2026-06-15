import { Event } from "../models/event.js";
import { Registration } from "../models/registration.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { eventHostValidation } from "../utils/eventHostValidation.js";
import { closeUnresolvedRegistrations } from "./registrationController.js";

async function createEvent(data, hostId) {
    const event = await Event.create({
        ...data,
        host: hostId,
    });
    return {
        message: "event created successfully",
        eventName: event.title,
    };
}

async function getAllEvents() {
    const events = await Event.find({ status: "published" }).sort({ date: 1 });
    return events;
}

async function getAllEventsByUser(hostId) {
    const events = await Event.find({ host: hostId }).sort({ date: 1 });
    return events;
}

async function getEventById(hostId,eventId) {
    const event = await Event.findOne({ host: hostId,_id:eventId} );
    return event;
}

async function getEventBySlug(req_slug) {
    const eventData = await Event.findOne({ slug: req_slug, status:{$in :["published","registration_closed", "completed","cancelled" ] } });
    if (!eventData) {
        return null;
    }
    const seatsLeft = await getSeatsLeft(eventData._id, eventData.capacity);
    return { eventData, seatsLeft };
}

async function eventUpdate(updatedData, eventId) {
    await Event.findByIdAndUpdate(eventId, { ...updatedData }, {
        new: true,
        runValidators: true,
    });
    return {
        message: "update done",
    };
}

async function deleteEvent(eventId) {
    await Event.findByIdAndDelete(eventId);
    return { message: "Event Deleted" };
}

async function publishEvent(eventId, status) {
    const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true, runValidators: true });
    return { message: "published status updated  ", event };
}

async function getSeatsLeft(eventId, capacity) {
    const count = await Registration.countDocuments({
        event: eventId,
        status: "approved",
    });
    return Math.max(0, capacity - count);
}

async function updateEventStatus(hostId, eventId, status) {
    if (!isValidObjectId(eventId)) {
        return { ok: false, status: 404, message: "invalid event id" };
    }

    const isHost = await eventHostValidation(hostId, eventId);
    if (!isHost.ok) {
        return { ok: false, status: 403, message: "Not authorized" };
    }

    if (status === "registration_closed") {
        await closeUnresolvedRegistrations(eventId);
        await publishEvent(eventId, status);
        return { ok: true, status: 200, message: "event registration_closed" };
    }

    await publishEvent(eventId, status);
    return { ok: true, status: 200, message: "event published" };
}

export {
    createEvent,
    getAllEvents,
    getEventById,
    getAllEventsByUser,
    getEventBySlug,
    eventUpdate,
    deleteEvent,
    publishEvent,
    getSeatsLeft,
    updateEventStatus,
};
