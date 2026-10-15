import mongoose, { Schema } from "mongoose";


const doctorSchema = new Schema({
    image: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    specialization: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    available: {
        type: [String],
        required: true
    },
    availableFrom: {
        type: String,
        required: true
    },
    availableTo: {
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
        timestamps: true
    }
);
const Doctor = mongoose.model("Doctor", doctorSchema)
export default Doctor;