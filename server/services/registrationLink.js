import { Registration } from "../models/registration.js";

 async function  linkRegistrationsToUser (userId,email){
    const updated = await Registration.updateMany({email,userId:null},{$set:{userId:userId}})
    return updated.modifiedCount
}

export{linkRegistrationsToUser}