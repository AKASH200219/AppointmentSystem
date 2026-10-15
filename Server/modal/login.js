import mongoose, { Schema } from "mongoose";

const loginSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const Login = mongoose.model("Login", loginSchema);

export default Login;