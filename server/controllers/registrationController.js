import { Registration } from "../models/registration.js";
import { Event } from "../models/event.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { eventHostValidation } from "../utils/eventHostValidation.js";

const APPROVABLE = ["pending", "waitlisted","rejected"];

async function registerForEvent(eventId, data, userId) {
    if (!isValidObjectId(eventId)) {
        return { ok: false, status: 400, message: "invalid event id" };
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return { ok: false, status: 404, message: "event not found" };
    }
    if (event.status !== "published") {
        return { ok: false, status: 400, message: "registration not open" };
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
        return { ok: false, status: 400, message: "registrations closed" };
    }

    let status = "";
    const seatsTaken = await Registration.countDocuments({
        event: eventId,
        status: { $in: ["approved", "pending"] },
    });

    if (seatsTaken >= event.capacity) {
        status = "waitlisted";
    } else if (event.registrationMode === "auto") {
        status = "approved";
    } else {
        status = "pending";
    }

    const existingRegistration = await Registration.findOne({
        event: eventId,
        email: data.email.toLowerCase(),
    });

    if (existingRegistration) {
        if (existingRegistration.status !== "cancelled") {
            return { ok: false, status: 400, message: "event already registered" };
        }

        const updated = await Registration.findByIdAndUpdate(
            existingRegistration._id,
            {
                name: data.name,
                phone: data.phone,
                organization: data.organization,
                status,
                ...(userId && { userId }),
            },
            { new: true }
        );

        return {
            ok: true,
            status: 201,
            message: "registration successful",
            statusValue: updated.status,
            registrationId: updated._id,
        };
    }

    const registrationData = {
        event: eventId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        status,
    };

    if (userId) {
        registrationData.userId = userId;
    }

    const newRegistration = await Registration.create(registrationData);

    return {
        ok: true,
        status: 201,
        message: "registration successful",
        statusValue: newRegistration.status,
        registrationId: newRegistration._id,
    };
}

async function getEventRegistrations(eventId, hostId) {
    if (!isValidObjectId(eventId)) {
        return { ok: false, status: 400, message: "invalid event id" };
    }

    const isHost = await eventHostValidation(hostId, eventId);
    if (!isHost.ok) {
        return { ok: false, status: 403, message: "Not authorized" };
    }

    const registrations = await Registration.find({ event: eventId });

    return {
        ok: true,
        status: 200,
        message: "found the registrations ",
        registrations,
    };
}

async function cancelRegistration(registrationId, email) {
    if (!isValidObjectId(registrationId)) {
        return { ok: false, status: 400, message: "invalid registration id" };
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
        return { ok: false, status: 404, message: "registration not there" };
    }

    const isSame = await Registration.findOne({
        _id: registrationId,
        email: email.toLowerCase(),
    });

    if (!isSame) {
        return { ok: false, status: 400, message: "invalid email id" };
    }

    if (isSame.status === "cancelled") {
        return { ok: false, status: 400, message: "already cancelled" };
    }

    await Registration.findByIdAndUpdate(registrationId, { status: "cancelled" }, { new: true });
    await promoteFromWaitlist(registration.event);

    return { ok: true, status: 200, message: "registration cancelled" };
}

async function closeUnresolvedRegistrations(eventId) {
    await Registration.updateMany(
        { event: eventId, status: { $in: ["pending", "waitlisted"] } },
        { $set: { status: "rejected" } }
    );
}

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
        updated,
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

    const updated = await Registration.findByIdAndUpdate(
        registrationId,
        { status: "rejected" },
        { new: true }
    );

    return {
        ok: true,
        status: 200,
        message: "registration not selected",
        updated,
    };
}

async function promoteFromWaitlist(eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
        return { ok: false, message: "not a valid event" };
    }

    const approved = await Registration.countDocuments({
        event: eventId,
        status: "approved",
    });

    if (approved >= event.capacity) {
        return { ok: false, status: 400, message: "event capacity filled" };
    }

    const oldest = await Registration.findOne({ status: "waitlisted", event: eventId }).sort({ registeredAt: 1 });
    if (!oldest) {
        return { ok: false, status: 400, message: "there are no registrations to be approved" };
    }

    const updated = await Registration.findByIdAndUpdate(oldest._id, { status: "approved" }, { new: true });

    return {
        status: 200,
        ok: true,
        updated,
        message: "updated to approved",
    };
}

export {
    registerForEvent,
    getEventRegistrations,
    cancelRegistration,
    closeUnresolvedRegistrations,
    approveRegistration,
    rejectRegistration,
    promoteFromWaitlist,
};
