import express from "express";
const authRouter = express.Router();
import { registerSchema } from "../validators/authValidator.js";
import { loginSchema } from "../validators/authValidator.js";
import { userCreate } from "../controllers/authController.js";
import { User } from "../models/user.js";


// authRouter.get("/test",function(req,res){
//     res.send("this is register page")
// })


authRouter.post("/register",async function(req,res){
    const registerResult = registerSchema.safeParse(req.body);

    if(!registerResult.success){
        return res.status(400).json({
            message:"Validation failed",
            errors:registerResult.error.issues
        })
    }
try {
    const userData = await userCreate(registerResult.data);
    return res.status(201).json({
        message:"new user registered",
        data:{name:userData.user.name,
            email:userData.user.email,
            token:userData.token
        }
    })
} catch (error) {

    if(error.code === 11000){
        return res.status(400).json({
            message:"user with this email already exists"
        })
    }
    return res.status(500).json({
        message:"server error"
    })
}



})

authRouter.post("/login",async function(req,res){
    console.log(req.body);

    const loginResult = loginSchema.safeParse(req.body);

    if(!loginResult.success){
        return res.status(400).json({
            message:"Validation failed",
            errors:loginResult.error.issues
        })
    }
    const {email,password} = loginResult;
   async function userAvailableCheck(email){
    
    const userData =  User.findOne({
        email:email
    })
   }
     })
     if(!loggedUser)
     {
        res.status(403).json({
            message:"user dont exits in db "
        })
     }
     else{
        loggedUser.comparePassword(password)
     }

})





export {authRouter}