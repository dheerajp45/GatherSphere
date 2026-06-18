import { Registration } from "../models/registration.js";
import { Event } from "../models/event.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { eventHostValidation } from "../utils/eventHostValidation.js";
import {sendEmail} from "../utils/email.js"
import {issueTicket} from "../utils/ticket.js"
const APPROVABLE = ["pending", "waitlisted","rejected"];

async function registerForEvent(eventId, data, userId,userMail) {
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
        const update = {
            name: data.name,
            phone: data.phone,
            organization: data.organization,
            status,
            ...(status==="approved"? issueTicket():{})
          };
          if (userId && userMail?.toLowerCase() === data.email.toLowerCase()) {
            update.userId = userId;  
          } else {
            update.userId = null;     
          }
        const updated = await Registration.findByIdAndUpdate(
            existingRegistration._id,
            update,
            { new: true }
        );
        if(updated){
            let text = "Registration received for the event.";
if (updated.status === "approved" && updated.ticketToken) {
  text += `\nYour ticket: http://localhost:5173/ticket/${updated.ticketToken}`;
}
            const emailBody={
                to:updated.email,
                subject:"registration received again",
                 text
            }
            await sendEmail(emailBody)
        }

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
        ...(status ==="approved"? issueTicket():{})
    };

    if (userId&& userMail === registrationData.email) {
        registrationData.userId = userId;
    }

    const newRegistration = await Registration.create(registrationData);
    if(newRegistration){
        let text = "Registration received for the event.";
if (newRegistration.status === "approved" && newRegistration.ticketToken) {
  text += `\nYour ticket: http://localhost:5173/ticket/${newRegistration.ticketToken}`;
}
        const emailBody={
            to:registrationData.email,
            subject:"registration received",
                             text
        }
        await sendEmail(emailBody)
    }
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

    const updated = await Registration.findByIdAndUpdate(registrationId, { 
        status: "cancelled",
        userId: null ,
        ticketToken:null,
        checkedInAt: null,
        checkInMethod: null,
        attendanceStatus: "not_marked",
    }, { new: true });
    if(updated){
        const emailBody={
            to:registration.email,
            subject:"registration cancelled",
            text:"Registration for the event cancelled"
        }
        await sendEmail(emailBody)
    }
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
        { status: "approved", ...issueTicket() },
        { new: true }
    );
    
    if(updated){

        const emailBody={
            to:reg.email,
            subject:"registration approved",
                 text:`you have been approved for the event ,
                 Your ticket: http://localhost:5173/ticket/${updated.ticketToken}`
        }
        await sendEmail(emailBody)
    }
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
    if(updated){
        const emailBody={
            to:reg.email,
            subject:"registration rejected",
            text:"Registration for the event rejected"
        }
        await sendEmail(emailBody)
    }

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

    const updated = await Registration.findByIdAndUpdate(oldest._id, { status: "approved", ...issueTicket() }, { new: true });
    if(updated){

        const emailBody={
            to:oldest.email,
            subject:"registration approved",
                            text:`you have been approved for the event ,
                 Your ticket: http://localhost:5173/ticket/${updated.ticketToken}`
        }
        await sendEmail(emailBody)
    }
    return {
        status: 200,
        ok: true,
        updated,
        message: "updated to approved",
    };
}

async function  markAttendance(registrationId, hostId, attendanceStatus) {
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

    if(reg.status !== "approved"){
        return { ok: false, status: 400, message: "Not Approved for the event" };
        }
        let date = null
if(attendanceStatus==="attended") date = new Date()
    // if(attendanceStatus==="absent") checkedInAt = null
       const update={
            attendanceStatus :attendanceStatus,
      checkInMethod :"manual",
      checkedInAt: date
        }
    
       const updatedData =  await Registration.findByIdAndUpdate(registrationId,update,{new:true} )
       return {
        ok: true,
        status: 200,           
        message: `marked ${attendanceStatus}`,
        updated: updatedData,    
      };
}
async function getTicketByToken(ticketToken){
    if(!ticketToken){
        return   { ok: false, status: 400, message: "token not availble" };
    }
   const registrationDetails = await  Registration.findOne({ ticketToken }).populate("event", "title date startTime endTime eventType venue online status slug")

  if(!registrationDetails){
    return { ok: false, status: 404 , message: "ticket not found" };
  }

  if(registrationDetails.status!=="approved"){
    return   { ok: false, status: 400, message: " ticket not available" };
  }
  return{
    ok:true,
    status:200,
    message:"token fetched and details are sent",
    ticketToken:registrationDetails.ticketToken,
    name:registrationDetails.name,
    checkedInAt:registrationDetails.checkedInAt,
    eventTitle:registrationDetails.event.title,
  }
}

async function getTicketById(registrationId, userId){
    if (!isValidObjectId(registrationId)) {
        return { ok: false, status: 400, message: "invalid registration id" };
    }

    const registrationDetails = await  Registration.findById( registrationId ).populate("event", "title date startTime endTime eventType venue online status slug")
    if (!registrationDetails) {
        return { ok: false, status: 404, message: "registration not found" };
    }
    if(String(registrationDetails.userId)!==String(userId)){
        return { ok: false, status: 403, message: "unauthorized registration" };
    }
    if(!registrationDetails.ticketToken){
        return   { ok: false, status: 400, message: "token not availble" };
    }
    if(registrationDetails.status!=="approved"){
        return   { ok: false, status: 400, message: " ticket not available" };
      }

      
      return{
        ok:true,
        status:200,
        message:"token fetched and details are sent",
        ticketToken:registrationDetails.ticketToken,
        name:registrationDetails.name,
        checkedInAt:registrationDetails.checkedInAt,
        eventTitle:registrationDetails.event.title,
      }

}

async function checkInByToken(ticketToken, hostId){
    if(!ticketToken){
        return   { ok: false, status: 400, message: "token not availble" };
    }
   const registrationDetails = await  Registration.findOne({ ticketToken }).populate("event", "title date startTime endTime eventType venue online status slug")

  if(!registrationDetails){
    return { ok: false, status: 404 , message: "ticket not found" };
  }

  if(registrationDetails.status!=="approved"){
    return   { ok: false, status: 400, message: " ticket not available" };
  }
  const isHost = await eventHostValidation(hostId, registrationDetails.event._id);
  if (!isHost.ok) {
      return { ok: false, status: 403, message: "Not authorized" };
  }
  if(registrationDetails.attendanceStatus === "attended"){
    return   { ok: true, status: 200, message:"already checked in" };
  }
  
  const updated = await Registration.findByIdAndUpdate(registrationDetails._id,{
    attendanceStatus:"attended",
    checkedInAt:new Date(),
    checkInMethod:"qr"
  },{new:true})

  return{
    ok:true,
    status: 200,
    message:"attendence by qr marked",
    name:registrationDetails.name,
    eventTitle:registrationDetails.event.title,
    checkedInAt:updated.checkedInAt
  }
}
export {
    registerForEvent,
    getEventRegistrations,
    cancelRegistration,
    closeUnresolvedRegistrations,
    approveRegistration,
    rejectRegistration,
    promoteFromWaitlist,
    markAttendance,
    getTicketByToken,getTicketById,checkInByToken
};
