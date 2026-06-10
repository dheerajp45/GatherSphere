import { Event } from "../models/event.js";
import {Registration} from "../models/registration.js";
import mongoose from "mongoose";
async function  createEvent(data,hostId){
    const event = await Event.create({
        ...data,
        host:hostId
    }
    )
    return ({
        message:"event created successfully",
        eventName:event.title,
    })

}

async function getAllEvents() {
    const events = await Event.find({status:"published"}).sort({date:1});
    return events
}

async function getAllEventsByUser(hostId){
    const events = await Event.find({host:hostId}).sort({date:1});
    return events
}

async function getEventBySlug(req_slug) {
    const eventData =  await Event.findOne({slug:req_slug,status:"published"})
    if(!eventData){
        return null;
    }
   const  seatsLeft =await  getSeatsLeft(eventData._id,eventData.capacity)
    return {eventData:eventData ,
        seatsLeft:seatsLeft}   
}

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async function eventHostValidation(hostId,eventId){
    const event = await Event.findById(eventId)
    if(!event) return {message:"event not found",ok:false}
    if(event.host.toString()!==hostId){return {message:"not the actual host",ok:false}}
    else return {ok:true} 
  }
  async function eventUpdate(updatedData,eventId) {
    await Event.findByIdAndUpdate(eventId,{...updatedData},{
        new:true,
        runValidators:true
    })    
    return {
        message:"update done"
    }
  }
async function deleteEvent(eventId){
    await Event.findByIdAndDelete(eventId)
    return {message:"Event Deleted"}
}

async function publishEvent(eventId,status) {
    const event = await Event.findByIdAndUpdate(eventId,{status},{new:true,runValidators:true}) 
    return {message :"published status updated  ",event}
    
}
async function getSeatsLeft(eventId,capacity){
    const count = await Registration.countDocuments({
        event:eventId,
        status:"approved",
    })
    return Math.max(0, capacity - count);
}
export{createEvent,getAllEvents,getAllEventsByUser,getEventBySlug,isValidObjectId,eventHostValidation,eventUpdate,deleteEvent,publishEvent,getSeatsLeft}