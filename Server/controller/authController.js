import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Login from "../modal/login.js";
import Doctors from "../modal/doctor.js";

import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/jwt.js";
import Staff from "../modal/staff.js";
import Lab from "../modal/lab.js";


const generateToken = (userId, role) => {

  return jwt.sign(
    {
      userId: userId.toString(),
      role: role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );

};

export const userLogin = async (req, res) => {

  try {

    const { name, password } = req.body;

    if (!name || !password) {

      return res.status(400).json({success: false,message: "Username and password are required"});

    }

    const user = await Login.findOne({username: name});

    console.log("Login user:", user);

    if (!user) {

      return res.status(400).json({success: false,message: "User is not available"});

    }
    const isMatch = await bcrypt.compare(password,user.password);


    if (!isMatch) {

      return res.status(401).json({success: false,message: "Invalid Password"});

    }

    const token = generateToken(
      user._id,
      user.role
    );

    console.log("JWT TOKEN:", token);

    const userData = {
      _id: user._id,
      username: user.username,
      role: user.role

    };

    if (user.role === "doctor") {
      const doctor = await Doctors.findOne({ commonKey: user._id });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        token: token,
        user: userData,
        doctor: doctor
      });
    }

    if (user.role === "staff") {
      const staff = await Staff.findOne({
        commonKey: user._id
      });

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff profile not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        token: token,
        user: userData,
        staff: staff
      });
    }

    if (user.role === "lab") {
      let lab = await Lab.findOne({ commonKey: user._id });
      if (!lab) {
        lab = await Lab.findOne({ email: user.username });
      }

      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        token: token,
        user: userData,
        lab: lab
      });
    }

    return res.status(200).json({ success: true, message: "Login Successfully", token: token, user: userData });

  } 
  catch (error) {

    console.log("Login Failed:",error);

    return res.status(500).json({success: false,message: "Failed to login"});

  }

};
export const getCurrentUser = async (req, res) => {
  try {
   
    return res.status(200).json({success: true,user: req.user,});
  } 
  catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({success: false,message: 'Server error fetching user profile',});
  }
};