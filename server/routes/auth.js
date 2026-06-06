import express from "express";
const authRouter = express.Router();
import { registerSchema } from "../validators/authValidator.js";
import { loginSchema } from "../validators/authValidator.js";
import { userCreate,formatAuthUser } from "../controllers/authController.js";
import { User } from "../models/user.js";
import { generateToken } from "../controllers/generateToken.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// authRouter.get("/test",function(req,res){
//     res.send("this is register page")
// })


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
    // console.log(req.body);

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
        const token = generateToken(loggedUser)

        return res.status(200).json({message:"login done",
            token:token,
            user:formatAuthUser(loggedUser)
        })
    }

})
authRouter.get("/me",authMiddleware,(req,res)=>{
return res.json({message:"this is your page..success",
    user:req.user
})
})







export { authRouter }