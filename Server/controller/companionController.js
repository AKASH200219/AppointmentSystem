import Companion from "../modal/companion.js";
import Login from "../modal/login.js";
import Staff from "../modal/staff.js";
import User from "../modal/user.js";

export const companionAdd = async (req, res) => {
  try {
    const {
      userId,
      service,
      patientName,
      age,
      gender,
      preferredDate,
      preferredTime,
      phone,
      address,
      latitude,
      longitude,
    } = req.body;

    const companion = new Companion({
      userId,
      selectService: service,
      patientName,
      Age: Number(age),
      Gender: gender,
      PreferredDate: preferredDate,
      PreferredTime: preferredTime,
      phone,
      Address: address,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    await companion.save();

    res.status(201).json({
      message: "Companion request added successfully",
      companion,
    });

  } catch (error) {
    console.error("Error adding companion:", error);

    res.status(500).json({
      message: "Error adding companion",
      error: error.message,
    });
  }
};


export const getCompanions = async (req, res) => {
  try {
    const companions = await Companion.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Companions retrieved successfully", companions });
  } catch (error) {
    res.status(500).json({ message: "Failed to get companions", error: error.message });
  }
};


export const updateCompanionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedCompanionName, assignedCompanionPhone, assignedLocation, companionLatitude, companionLongitude } = req.body;

    const updateObj = {};
    if (status !== undefined) updateObj.status = status;
    if (assignedCompanionName !== undefined) updateObj.assignedCompanionName = assignedCompanionName;
    if (assignedCompanionPhone !== undefined) updateObj.assignedCompanionPhone = assignedCompanionPhone;
    if (assignedLocation !== undefined) updateObj.assignedLocation = assignedLocation;
    if (companionLatitude !== undefined) updateObj.companionLatitude = companionLatitude;
    if (companionLongitude !== undefined) updateObj.companionLongitude = companionLongitude;

    const updated = await Companion.findByIdAndUpdate(id, updateObj, { new: true });

    if (!updated) return res.status(404).json({ message: "Companion request not found" });

    res.status(200).json({ message: `Companion details updated successfully`, companion: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating companion details", error: error.message });
  }
};

export const assignCompanionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedCompanionName, assignedCompanionPhone, assignedLocation, companionLatitude, companionLongitude, status } = req.body;

    const updated = await Companion.findByIdAndUpdate(
      id,
      {
        assignedCompanionName,
        assignedCompanionPhone,
        assignedLocation,
        companionLatitude: companionLatitude ? Number(companionLatitude) : undefined,
        companionLongitude: companionLongitude ? Number(companionLongitude) : undefined,
        status: status || "Accepted",
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Companion request not found" });

    res.status(200).json({ message: "Companion assigned successfully", companion: updated });
  } catch (error) {
    res.status(500).json({ message: "Error assigning companion", error: error.message });
  }
};


export const companionStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("User ID from params:", userId);

    let user = await User.findOne({ commonKey: userId });
    if (!user) {
      user = await User.findById(userId).catch(() => null);
    }

    const queryConditions = [{ userId }];
    if (user) {
      queryConditions.push({ userId: user._id });
    }

    const Companionresult = await Companion.find({ $or: queryConditions }).sort({ createdAt: -1 });

    console.log("Companion result:", Companionresult);

    return res.status(200).json({ message: "Bookings fetched successfully", Companionresult });

  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      message: "Unable to get companion status", error: error.message,
    });
  }
};



// export const companiondetails = async (req, res) => {
//   try {
//     const {companionId} = req.params;
//     const companion = await Staff.findById({ commonKey: companionId });
    
//     const companions = await Companion.find()
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       message: "Companion details fetched successfully",
//       companions,companion
//     });

//   } catch (err) {
//     console.log("Can't get Companion details:", err);

//     return res.status(500).json({
//       message: "Can't get companion details",
//       error: err.message
//     });
//   }
// };


export const companiondetails = async (req, res) => {
  try {
    const { companionId } = req.params;

    console.log("Received companionId:", companionId);

    const companion = await Staff.findOne({
      commonKey: companionId
    });

    console.log("Staff found:", companion);


    const companions = await Companion.find()
      .sort({ createdAt: -1 });

    console.log("Companion requests:", companions);

    return res.status(200).json({
      message: "Companion details fetched successfully",
      companions,
      companion
    });

  } catch (err) {
    console.log("Can't get Companion details:", err);

    return res.status(500).json({
      message: "Can't get companion details",
      error: err.message
    });
  }
};
