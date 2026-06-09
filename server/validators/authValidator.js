import {z} from "zod";
const registerSchema = z.object({
    name:z
    .string()
    .min(1,{message:"name is required"}),
    email: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "invalid email" }), 
    password:z
    .string()
    .min(6,{message:"password must be at least 6 characters"}),
    profilePicture: z
    .union(
        [z.literal(""),
            z.url({ error: "profile picture must be a valid URL"})
        ]
    ).optional()
})
 const loginSchema =z.object({
    email: z
    .string()
    // .nonempty("Required")
    .min(1, { message: "email is required" })
    .email({ message: "invalid email" }), 
    password:z
    .string()
    .min(6,{message:"password must be at least 6 characters"})
 })

export {registerSchema as registerSchema,
    loginSchema as loginSchema
}