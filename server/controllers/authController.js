// import mongoose from "mongoose";
import { User } from "../models/user.js";
import { generateToken } from "../controllers/generateToken.js";

async function userCreate(data){
    // const {name,email,password,profilePicture} = data;
    const user = await User.create(data)
    const token = generateToken(user)
    return {user:user,
        token:token
        
    };
}

export {userCreate}