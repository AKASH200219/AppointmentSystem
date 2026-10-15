import Login from "../modal/login.js";
import bcrypt from "bcryptjs";
import User from "../modal/user.js";

export const RegisterUser = async (req, res) => {
    console.log(req.body,"req.body");
  try {
    const {name,phone,email,dob,gender,address,password,confirmpsw,} = req.body;

    if (!name || !email || !password || !confirmpsw) {
      return res.status(400).json({ message: "Missing field of name or email or password or confirmpsw",});
    }

    const existingUser = await Login.findOne({ username: email });
    console.log(existingUser,"existingUser");

    if (existingUser) {
      return res.status(400).json({message: "Already existing the user"});
    }

    // if (password !== confirmpsw) {
    //   return res.status(400).json({message: "Password and Confirm Password do not match"});
    // }

    const hashedPsw = await bcrypt.hash(password, 10);

    const Loginpage = new Login({
      username: email,
      password: hashedPsw,
      role: "user",
    });

    await Loginpage.save();

    let imagepath = req.file?.filename || null;

    const result = new User({name,phone,email,dob,gender,address,image: imagepath,commonKey: Loginpage._id});

    await result.save();
    console.log(result);
    

    return res.status(201).json({message: "Data saved successfully",result});
  } 
  catch (err) {
    console.log("Failed to create user", err);
    return res.status(500).json({message: "Failed to create user",});
  }
};


export const userinfo = async (req, res) => {
  try {

    const { userid } = req.params;

    console.log("Login ID:", userid);

    const result = await User.findOne({commonKey: userid});

    console.log("User:", result);

    if (!result) {
      return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json({message: "User info get successfully",result: result});

  } 
  catch (err) {

    console.log("Error:", err);

    return res.status(500).json({message: "User cannot get"});

  }
};