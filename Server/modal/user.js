import mongoose, { Schema } from "mongoose";


const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    commonKey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Login",
        required: true
    }


},
    {
        timeStamps: true
    }
)
const User = mongoose.model("User", userSchema)
export default User;