import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js"

function generateToken(user){
    const signed_data = jwt.sign({
        id:user._id.toString(),
        name:user.name,
        email:user.email
    },JWT_SECRET,{expiresIn:"1d"})
    return signed_data; 
}
export {generateToken}