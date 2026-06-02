import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js"

function authMiddleware(req,res,next){
    const received_token = req.headers.authorization
    if(!received_token){
        return res.status(401).json({
            message:"authorization not found"
        })
    }

    if(!received_token.startsWith("Bearer ")){
        return res.status(401).json({
            message:"token does not include bearer"
    })
    }
    const actual_token = received_token.slice(7)
    // console.log(token);
    
    try {
        const decoded = jwt.verify(actual_token,JWT_SECRET)
        if(decoded){
            req.user =  decoded;
            return next();
            }
    } catch (error) {
        return res.status(401).json({
            message:"you are not signed in"
        })
    }
    

}

export {authMiddleware}