import Doctor from "../modal/doctor.js";
import Login from "../modal/login.js";
import bcrypt from "bcryptjs";

export const docReg = async (req, res) => {
  try {
    const { name, phone, email, dob, gender, address, specialization, qualification, about, experience,
      fees, hospital, available, availableFrom, availableTo,
      password, confrmPassword } = req.body;

    const existingDoctor = await Login.findOne({ username: email });
    if (existingDoctor) {
      return res.status(200).json({ message: "Already exist the doctor" })
    }
    if (password !== confrmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }
    const hashpasswrd = await bcrypt.hash(password, 10);
    const Loginpage = new Login({
      username: email,
      password: hashpasswrd,
      role: "doctor"
    })
    await Loginpage.save();

    let imagepath = req.file?.filename || null;
    const result = new Doctor({
      image: imagepath, name, phone, email, dob, gender, address, specialization,
      qualification, about, experience, fees, hospital, available, availableFrom, availableTo,
      commonKey: Loginpage._id
    })
    await result.save();
    console.log("DoctorReg:", result);
    return res.status(200).json({ message: "Successfully Registered Doctor", result })

  }
  catch (err) {
    console.log("Registration Failed", err);
    return res.status(500).json({ message: "Failed to register doctor" })
  }
}
export const docinfo = async (req, res) => {
  try {
    const { doctorid } = req.params;

    console.log("Doctor ID / Login ID:", doctorid);

    let result = await Doctor.findById(doctorid).catch(() => null);
    if (!result) {
      result = await Doctor.findOne({ commonKey: doctorid });
    }

    console.log("Doctor:", result);

    if (!result) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      message: "Doctor info get successfully",
      result: result
    });

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Doctor cannot get"
    });
  }
};

export const viewDoctors = async (req, res) => {
  try {
    const result = await Doctor.find();
    console.log("Doctors count:", result.length);
    return res.status(200).json({
      message: "Doctor details fetched successfully",
      result: result
    });
  } catch (err) {
    console.log("View Doctors Error:", err);
    return res.status(500).json({
      message: "Failed to fetch doctors"
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { doctorid } = req.params;
    const {
      name,
      phone,
      email,
      dob,
      gender,
      address,
      specialization,
      qualification,
      about,
      experience,
      fees,
      hospital,
      available,
      availableFrom,
      availableTo,
      password
    } = req.body;

    const doctor = await Doctor.findById(doctorid);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let imagepath = doctor.image;
    if (req.file) {
      imagepath = req.file.filename;
    }

    let formattedAvailable = doctor.available || [];
    if (available !== undefined && available !== null) {
      if (Array.isArray(available)) {
        formattedAvailable = available;
      } else if (typeof available === "string") {
        try {
          const parsed = JSON.parse(available);
          if (Array.isArray(parsed)) {
            formattedAvailable = parsed;
          } else {
            formattedAvailable = available.split(",").map((d) => d.trim()).filter(Boolean);
          }
        } catch {
          formattedAvailable = available.split(",").map((d) => d.trim()).filter(Boolean);
        }
      }
    }

    const updateData = {
      image: imagepath,
      name: name ?? doctor.name,
      phone: phone !== undefined ? Number(phone) : doctor.phone,
      email: email ?? doctor.email,
      dob: dob ?? doctor.dob,
      gender: gender ?? doctor.gender,
      address: address ?? doctor.address,
      specialization: specialization ?? doctor.specialization,
      qualification: qualification ?? doctor.qualification,
      about: about ?? doctor.about,
      experience: experience !== undefined ? Number(experience) : doctor.experience,
      fees: fees !== undefined ? Number(fees) : doctor.fees,
      hospital: hospital ?? doctor.hospital,
      available: formattedAvailable,
      availableFrom: availableFrom ?? doctor.availableFrom,
      availableTo: availableTo ?? doctor.availableTo,
    };

    const result = await Doctor.findByIdAndUpdate(doctorid, updateData, { new: true });

    if (doctor.commonKey) {
      const loginUpdate = {};
      if (email) loginUpdate.username = email;
      if (password && password.trim()) {
        loginUpdate.password = await bcrypt.hash(password, 10);
      }
      if (Object.keys(loginUpdate).length > 0) {
        await Login.findByIdAndUpdate(doctor.commonKey, loginUpdate);
      }
    }

    console.log("Updated Doctor:", result);
    return res.status(200).json({
      message: "Doctor updated successfully",
      result
    });
  } catch (err) {
    console.log("Update Doctor Error:", err);
    return res.status(500).json({
      message: err.message || "Failed to update doctor"
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { doctorid } = req.params;
    const doctor = await Doctor.findById(doctorid).catch(() => null);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.commonKey) {
      await Login.findByIdAndDelete(doctor.commonKey).catch(() => null);
    }

    const result = await Doctor.findByIdAndDelete(doctorid).catch(() => null);

    return res.status(200).json({
      message: "Doctor deleted successfully",
      result
    });
  } catch (err) {
    console.log("Failed to delete doctor:", err);
    return res.status(500).json({
      message: "Failed to delete doctor"
    });
  }
};