// import mongoose from "mongoose";
import { User } from "../models/user.js";
import { generateToken } from "../controllers/generateToken.js";
import { linkRegistrationsToUser } from "../services/registrationLink.js";

async function userCreate(data){
    // const {name,email,password,profilePicture} = data;
    const user = await User.create(data)
    const registrationsLinkCount = await linkRegistrationsToUser(user._id,user.email);
   let linkStatus=""
    if (registrationsLinkCount>0) {
        linkStatus=`linked ${registrationsLinkCount} guest registrations`
    } else {
        linkStatus = "nothing to link";
    }
    const token = generateToken(user)
    return {user:user,
        token:token,
        linkStatus:linkStatus      
    };
}

function formatAuthUser(user){
return {id:user._id,
    name:user.name,
    email:user.email
}
}

export {userCreate,formatAuthUser}