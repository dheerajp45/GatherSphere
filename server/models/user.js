
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
import bcrypt from "bcryptjs" 

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    createdAt:
    {
        type: Date,
        default: Date.now
    }

})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password,10);
    // next();
})

userSchema.methods.comparePassword= async function (inputPassword) {
    const result = await bcrypt.compare(inputPassword,this.password);
        return result;
};

// const purchaseSchema = new Schema({
//     userId: ObjectId,
//     courseId: ObjectId,

// });
const User = mongoose.model('User', userSchema);

export {User}