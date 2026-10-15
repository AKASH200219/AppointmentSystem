import Appointment from "../modal/appointment.js";
import Token from "../modal/token.js";
import Doctor from "../modal/doctor.js";
import User from "../modal/user.js";
import mongoose from "mongoose";

export const ConfirmAppointment = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { appointmentDate, patientName, phoneNumber, dob, age, symptoms, userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "User ID is missing. Please log in first." });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const parsedAppointmentDate =
      typeof appointmentDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)
        ? new Date(`${appointmentDate}T00:00:00.000Z`)
        : null;

    if (
      !parsedAppointmentDate ||
      Number.isNaN(parsedAppointmentDate.getTime()) ||
      parsedAppointmentDate.toISOString().slice(0, 10) !== appointmentDate
    ) {
      return res.status(400).json({ message: "Appointment date is missing" });
    }

    const numericPhone = Number(phoneNumber);
    const numericAge = Number(age);
    const parsedDob =
      typeof dob === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dob)
        ? new Date(`${dob}T00:00:00.000Z`)
        : null;

    if (
      !patientName?.trim() ||
      !Number.isFinite(numericPhone) ||
      numericPhone <= 0 ||
      !Number.isInteger(numericAge) ||
      numericAge <= 0 ||
      !parsedDob ||
      Number.isNaN(parsedDob.getTime()) ||
      parsedDob.toISOString().slice(0, 10) !== dob
    ) {
      return res.status(400).json({ message: "Please fill in all required patient details (Name, Phone, DOB, Age)." });
    }

    const doctor = await Doctor.findById(doctorId);
    const patient =
      (await User.findOne({ commonKey: userId })) ||
      (await User.findById(userId));

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!patient) {
      return res.status(404).json({
        message: "Your user profile was not found. Please log in again or contact support.",
      });
    }

    const month = appointmentDate.slice(0, 7);
    const tokenData = await Token.findOneAndUpdate(
      {
        doctorId,
        month,
        $expr: {
          $lt: [{ $ifNull: ["$bookedtoken", 0] }, "$token"],
        },
      },
      { $inc: { bookedtoken: 1 } },
      { new: true }
    );

    if (!tokenData) {
      const monthlyTokens = await Token.findOne({ doctorId, month });
      return res.status(monthlyTokens ? 400 : 404).json({
        message: monthlyTokens
          ? "All appointment tokens for this month are booked"
          : "No appointment tokens are configured for this doctor and month",
      });
    }

    const tokenNumber = tokenData.bookedtoken;

    const appointment = new Appointment({
      userId: patient._id,
      doctorId,
      tokenId: tokenData._id,
      appointmentDate,
      tokenNumber,
      patientName,
      phone: numericPhone,
      dob,
      age: numericAge,
      symptoms: symptoms || ""
    });

    try {
      await appointment.save();
    } catch (error) {
      await Token.updateOne(
        { _id: tokenData._id },
        { $inc: { bookedtoken: -1 } }
      );
      throw error;
    }

    return res.status(201).json({ message: "Appointment confirmed successfully", tokenNumber, appointment });

  }
  catch (err) {

    console.error("Failed to confirm appointment:", err);

    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        message: "Appointment details are invalid",
        error: err.message,
      });
    }

    return res.status(500).json({ message: "Failed to confirm appointment", error: err.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching appointments for user:", userId);

    const patient = mongoose.Types.ObjectId.isValid(userId)
      ? await User.findOne({ commonKey: userId })
      : null;
    const userIds = patient ? [patient._id, userId] : [userId];
    const appointments = await Appointment.find({ userId: { $in: userIds } })
      .populate("doctorId")
      .populate("tokenId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "User appointments retrieved successfully", appointments });
  } catch (err) {
    console.log("Failed to get user appointments:", err);
    return res.status(500).json({ message: "Failed to get user appointments", error: err.message });
  }
};



export const getAppointments = async (req, res) => {
  const { doctorid } = req.params;
  try {
    const appointment = await Appointment.find({ doctorId: doctorid });
    return res.status(200).json({ message: "Retrive the appointment data", appointment });
  }
  catch (err) {
    console.log("Failed to get appointment data");
    return res.status(500).json({ message: "Can't get the appontment data" })

  }
}

export const updateStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, { status: status }, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Status updated successfully", appointment });

  }
  catch (error) {

    console.log("Update status error:", error);

    res.status(500).json({ message: "Failed to update status" });

  }
};

export const getDetails = async (req, res) => {
  try {
    const { Doctorid } = req.params;

    console.log("Doctor id:", Doctorid);

    const appointments = await Appointment.find({ doctorId: Doctorid });

    return res.status(200).json({ message: "Retrieve the appointment data", appointments });
  }
  catch (err) {
    console.log("Failed to get appointment data:", err);

    return res.status(500).json({ message: "Can't get the appointment data" });
  }
};

export const DetailsAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    console.log("Appointment ID:", appointmentId);
    const appointmentDetails = await Appointment.findById(appointmentId);
    console.log("appointment details:", appointmentDetails);


    if (!appointmentDetails) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json({ message: "Appointment details retrieved", appointmentDetails });
  }
  catch (err) {
    console.log("Failed to get appointment details");
    return res.status(500).json({ message: "Failed to get appointment details" })

  }
}
