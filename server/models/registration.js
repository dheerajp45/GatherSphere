import mongoose from "mongoose";
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    

    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim:true,
    },

    organization:{
        type:String,
        trim:true
    },
    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
            "waitlisted",
            "cancelled",
        ],
        default: "pending",
    },
    attendanceStatus: {
        type:String,
        enum:[
            "not_marked" ,
            "attended" ,
        "absent"],
        
          default: "not_marked"},

    registeredAt:
    {
        type: Date,
        default: Date.now
    }
})
registrationSchema.index({"event":1, "email":1},{unique:true});

const Registration = mongoose.model('Registration', registrationSchema);


export {Registration}