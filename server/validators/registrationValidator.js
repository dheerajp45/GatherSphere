import {z} from "zod";
const registerForEventSchema = z.object({
    name: z.string().min(1, { message: "name is required" }),
    email: z.string().min(1).email({ message: "invalid email" }),
    phone: z.string().min(1, { message: "phone is required" }),
    organization: z.string().trim().optional(),
  })
const registrationDeleteSchema = z.object({
  email:z.string().min(1).email({message:"invalid email"}),
})
const attendanceSchema = z.object({
  attendanceStatus: z.enum(["attended", "absent"])
})
const checkInSchema = z.object({
  ticketToken: z.string().min(1, { message: "ticket token required" })
})
  export {registerForEventSchema,registrationDeleteSchema,attendanceSchema,checkInSchema}