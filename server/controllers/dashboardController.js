import { Event } from "../models/event.js";
import { Registration } from "../models/registration.js";

async function  eventHostedByUser(hostId){
    const events = await Event.find({host:hostId});
    return events.length;
}

async function upcomingEvents(hostId){
    const today =  new Date();
    today.setHours(0,0,0,0);
    const events = await Event.countDocuments({
        host:hostId,
        date:{$gte:new Date() }
    })
    return events;
}

async function  totalRegistrationsDone(hostId){
    const events = await Event.find({
        host : hostId
    }).select('_id')
    const eventIds = events.map(e=>e._id)
    if(eventIds.length===0){
        return 0;
    }
    const count = await Registration.countDocuments({
        event:{$in:eventIds},
        status:{$in:["approved", "pending","waitlisted",]}
    })
    return count;
} 
async function getMyRegistrations(userId) {
    const myRegistrations=await Registration.find({userId:userId}).populate("event");
    return myRegistrations
    
}



export {eventHostedByUser,upcomingEvents,totalRegistrationsDone,getMyRegistrations}