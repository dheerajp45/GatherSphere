import {Registration} from "../models/registration.js"
import {Event} from "../models/event.js"

import {eventHostValidation, isValidObjectId} from "./eventController.js"

const APPROVABLE=["pending","waitlisted"]

async function approveRegistration(registrationId, hostId) {
    if (!isValidObjectId(registrationId)) {
        return { ok: false, status: 400, message: "invalid registration id" };
    }

    const reg = await Registration.findById(registrationId);
    if (!reg) {
        return { ok: false, status: 404, message: "registration not found" };
    }

    const isHost = await eventHostValidation(hostId, reg.event);
    if (!isHost.ok) {
        return { ok: false, status: 403, message: "Not authorized" };
    }

    if (!APPROVABLE.includes(reg.status)) {
        return { ok: false, status: 400, message: "cannot approve this registration" };
    }

    const event = await Event.findById(reg.event);
    const seatsTaken = await Registration.countDocuments({
        event: reg.event,
        status: "approved",
    });

    if (seatsTaken >= event.capacity) {
        return { ok: false, status: 400, message: "No seats available" };
    }

    const updated = await Registration.findByIdAndUpdate(
        registrationId,
        { status: "approved" },
        { new: true }
    );

    return {
        ok: true,
        status: 200,
        message: "registration updated",
        updated:updated,
    };
}

async function rejectRegistration(registrationId, hostId) {
    if (!isValidObjectId(registrationId)) {
        return { ok: false, status: 400, message: "invalid registration id" };
    }

    const reg = await Registration.findById(registrationId);
    if (!reg) {
        return { ok: false, status: 404, message: "registration not found" };
    }

    const isHost = await eventHostValidation(hostId, reg.event);
    if (!isHost.ok) {
        return { ok: false, status: 403, message: "Not authorized" };
    }

    // if (!APPROVABLE.includes(reg.status)) {
    //     return { ok: false, status: 400, message: "cannot reject this registration" };
    // }

    const updated = await Registration.findByIdAndUpdate(
        registrationId,
        { status: "rejected" },
        { new: true }
    );

    return {
        ok: true,
        status: 200,
        message: "registration not selected",
        updated:updated,
    };
}

export { approveRegistration, rejectRegistration };
