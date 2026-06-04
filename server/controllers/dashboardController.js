import { Event } from "../models/event.js";


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

export {eventHostedByUser,upcomingEvents}