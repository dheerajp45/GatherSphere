import mongoose from "mongoose";
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Types.ObjectId;
import randomstring from "randomstring"
import slugify from "slugify"
const eventSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        enum: ["Tech", "Business", "Education", "Arts", "Sports", "Other"],
        required: true,
    },

    tags: [{
            type: String,
            trim: true,
        }],

    date: {
        type: Date,
        required: true,
    },

    startTime: {
        type: String,
        required: true,
    },

    endTime: {
        type: String,
        required: true,
    },

    eventType: {
        type: String,
        enum: ["offline", "online"],
        required: true,
    },

    venue: {
        name: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        mapLink: {
            type: String,
            trim: true,
        },
    },

    online: {
        platform: {
            type: String,
            trim: true,
        },

        meetingLink: {
            type: String,
            trim: true,
        },
    },

    capacity: {
        type: Number,
        required: true,
        min: 1,
    },

    registrationDeadline: {
        type: Date,
    },

    registrationMode: {
        type: String,
        enum: ["auto", "manual"],
        default: "auto",
    },

    status: {
        type: String,
        enum: [
            "draft",
            "published",
            "registration_closed",
            "completed",
            "cancelled",
        ],
        default: "draft",
    },

    bannerImage: {
        type: String,
        default: "",
    },
    slug:{
        type:String,
        unique: true,
    },
    createdAt:
    {
        type: Date,
        default: Date.now
    }
})

eventSchema.pre("save",async function(){
if(this.slug&& !this.isModified("title"))
    {
    return;
}
const slugged_string=slugify(this.title,{
    lower:true,
    strict:true,
    trim:true,
    remove: /[*+~.()'"!:@]/g
});
this.slug = slugged_string+"-"+randomstring.generate(7);
})

const Event = mongoose.model('Event', eventSchema);

export {Event}