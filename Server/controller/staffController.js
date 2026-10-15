import Staff from "../modal/staff.js";
import Login from "../modal/login.js";
import bcrypt from "bcryptjs";

export const staffReg = async (req, res) => {
  try {

    const {
      name,
      phone,
      email,
      dob,
      gender,
      address,
      staffType,
      qualification,
      experience,
      password,
      confirmpsw
    } = req.body;

    const existingStaff = await Login.findOne({
      username: email
    });

    if (existingStaff) {

      return res.status(200).json({message: "Already exist the staff"});

    }

    const hashpasswrd = await bcrypt.hash(password,10);

    const Loginpage = new Login({

      username: email,
      password: hashpasswrd,
      role: "staff"

    });

    await Loginpage.save();

    let imagepath = req.file?.filename || null;

    const result = new Staff({

      image: imagepath,
      name,
      phone,
      email,
      dob,
      gender,
      address,
      staffType,
      qualification,
      experience,
      commonKey: Loginpage._id
    });

    await result.save();

    console.log("StaffReg:", result);

    return res.status(200).json({message: "Successfully Registered Staff",result});

  }

  catch (err) {

    console.log("Staff Registration Failed",err);
    return res.status(500).json({message: "Failed to register staff"});

  }
};


export const viewStaff = async (req, res) => {

  try {

    const result = await Staff.find();

    console.log("Staff:", result);

    return res.status(200).json({message: "Staff details get successfully",result: result});

  }

  catch (err) {

    console.log("Error:", err);

    return res.status(500).json({message: "Staff cannot get"});

  }

};


export const staffinfo = async (req, res) => {
  try {
    const { staffId } = req.params;

    let result = await Staff.findById(staffId).catch(() => null);

    if (!result) {
      result = await Staff.findOne({ commonKey: staffId }).catch(() => null);
    }

    if (!result) {
      return res.status(404).json({ message: "Staff not found" });
    }

    console.log("Single Staff:", result);

    return res.status(200).json({ message: "Staff info get successfully", result: result });

  }
  catch (err) {

    console.log("Staff Info Error:", err);

    return res.status(500).json({ message: "Staff cannot get" });

  }

};


export const updateStaff = async (req, res) => {

  try {

    const { staffId } = req.params;


    const {
      name,
      phone,
      email,
      dob,
      gender,
      address,
      staffType,
      qualification,
      experience
    } = req.body;

    const staff = await Staff.findById(staffId);

    if (!staff) {

      return res.status(404).json({

        message: "Staff not found" });

    }

    let imagepath = staff.image;

    if (req.file) {

      imagepath = req.file.filename;

    }

    const result = await Staff.findByIdAndUpdate( staffId,
      {image: imagepath,
        name,phone,
        email,
        dob,
        gender,
        address,
        staffType,
        qualification,
        experience

      },

      {
        new: true
      }

    );
    await Login.findByIdAndUpdate(

      staff.commonKey,

      {
        username: email
      }

    );


    console.log("Updated Staff:", result);


    return res.status(200).json({

      message: "Staff updated successfully",
      result: result

    });

  }

  catch (err) {

    console.log("Update Staff Error:", err);

    return res.status(500).json({

      message: "Failed to update staff"

    });

  }

};
export const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId).catch(() => null);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.commonKey) {
      await Login.findByIdAndDelete(staff.commonKey).catch(() => null);
    }

    const result = await Staff.findByIdAndDelete(staffId).catch(() => null);

    return res.status(200).json({ message: "Staff delete successfully", result });
  }
  catch (err) {
    console.log("Failed to delete staff:", err);
    return res.status(500).json({ message: "Failed to delete staff" });
  }
};




