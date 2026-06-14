import express from "express";
const authRouter = express.Router();
import { registerSchema } from "../validators/authValidator.js";
import { loginSchema } from "../validators/authValidator.js";
import { userCreate,formatAuthUser } from "../controllers/authController.js";
import { User } from "../models/user.js";
import { generateToken } from "../controllers/generateToken.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { linkRegistrationsToUser } from "../services/registrationLink.js";

authRouter.post("/register", async function (req, res) {
    const registerResult = registerSchema.safeParse(req.body);

    if (!registerResult.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: registerResult.error.issues
        })
    }
    try {
        const userData = await userCreate(registerResult.data);
        return res.status(201).json({
            message: "new user registered",
            token:userData.token,
            user:formatAuthUser(userData.user),
            linkStatus :userData.linkStatus
        })
    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "user with this email already exists"
            })
        }
        return res.status(500).json({
            message: "server error"
        })
    }



})

authRouter.post("/login", async function (req, res) {


    const loginResult = loginSchema.safeParse(req.body);

    if (!loginResult.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: loginResult.error.issues
        })
    }

    const { email, password } = loginResult.data;

    const loggedUser = await User.findOne({
        email: email
    })
    if (!loggedUser){
        return res.status(401).json({message:"user not found"})
    }
    const pwd_correct = await loggedUser.comparePassword(password)

     if(!pwd_correct){
        return res.status(401).json({message:"incorrect password"})
    }
    else{    
        const registrationsLinkCount = await linkRegistrationsToUser(loggedUser._id,loggedUser.email);
        let linkStatus=""
         if (registrationsLinkCount>0) {
             linkStatus=`linked ${registrationsLinkCount} guest registrations`
         } else {
             linkStatus = "nothing to link";
         }
        const token = generateToken(loggedUser)

        return res.status(200).json({message:"login done",
            token:token,
            user:formatAuthUser(loggedUser),
           linkStatus:linkStatus   
        })
    }

})
authRouter.get("/me",authMiddleware,(req,res)=>{
return res.json({message:"this is your page..success",
    user:req.user
})
})







export { authRouter }