import {z} from "zod";
const createEventSchema = z.object({
    title:z
    .string()
    .min(1,{message:"title is required"}),
    description:z
    .string()
    .min(50,{message:"minimum 50 characters of description is required"}),
    category:z
    .enum(["Tech", "Business", "Education", "Arts", "Sports", "Other"]),
    date:z
    .iso.date(),
    startTime:z
    .iso.time(),
    endTime:z
    .iso.time(),
    eventType:z
    .enum(["offline", "online"]),
    capacity:z
    .coerce.number()
    .min(1,{message:"Enter Capacity minimum 1"}),
    tags:z
    .array(z.string()).optional(),
    registrationDeadline:z
    .iso.date().optional(),
    registrationMode:z
    .enum(["auto","manual"]).optional(),
    bannerImage:z
    .url().optional(),
    venue: z.object({
        name: z.string(),
        address: z.string(),
        mapLink: z.url(),
      }).optional(),
      online: z.object({
        platform: z.string(),
        meetingLink: z.url(),
      }).optional(),
}).superRefine((data,ctx)=>{
    if(data.eventType==="offline"&& !data.venue?.name){
        ctx.addIssue({
            message:"needed venue name",
            path:["venue.name"]
        })
    }
    if(data.eventType === "online"&& !data.online?.meetingLink){
        ctx.addIssue({
            message:"needed meeting link",
            path:["online.meetingLink"]
        })
    }
  })


  const updateStatusSchema = z
  .object({
    status:
    z.enum([
        "draft",
    "published",
    "registration_closed",
    "completed",
    "cancelled",
    ])
  })
export {createEventSchema,updateStatusSchema}