import {z} from "zod";
const registerForEventSchema = z.object({
    name: z.string().min(1, { message: "name is required" }),
    email: z.string().min(1).email({ message: "invalid email" }),
    phone: z.string().min(1, { message: "phone is required" }),
    organization: z.string().trim().optional(),
  })

  export {registerForEventSchema}