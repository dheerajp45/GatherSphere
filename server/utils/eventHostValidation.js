import { Event } from "../models/event.js";

async function eventHostValidation(hostId, eventId) {
    const event = await Event.findById(eventId);
    if (!event) return { message: "event not found", ok: false };
    if (event.host.toString() !== hostId) {
        return { message: "not the actual host", ok: false };
    }
    return { ok: true };
}

export { eventHostValidation };
