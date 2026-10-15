import bcrypt from "bcryptjs";
import Lab from "../modal/lab.js";
import LabTest from "../modal/labTest.js";
import LabBooking from "../modal/labBooking.js";
import LabStaff from "../modal/labStaff.js";
import Login from "../modal/login.js";

// ================= LAB CONTROLLERS (ADMIN / LAB) =================

// Create a new Lab (Admin)
export const createLab = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      phone,
      email,
      password,
      confirmPassword,
      timing,
      description,
      accreditation,
      rating,
      features,
      status,
    } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lab name, email, phone, and address/location are required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email in Login and Lab
    const existingLogin = await Login.findOne({ username: normalizedEmail });
    if (existingLogin) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const existingLab = await Lab.findOne({ email: normalizedEmail });
    if (existingLab) {
      return res.status(400).json({
        success: false,
        message: "A lab with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Login credential for Lab
    const newLogin = new Login({
      username: normalizedEmail,
      password: hashedPassword,
      role: "lab",
    });
    await newLogin.save();

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    let parsedFeatures = [
      "Home Sample Collection",
      "Online Digital Reports",
      "Certified Pathologists",
      "Express Turnaround",
    ];
    if (features) {
      parsedFeatures = Array.isArray(features)
        ? features
        : features.split(",").map((f) => f.trim()).filter(Boolean);
    }

    const newLab = new Lab({
      name,
      image,
      address,
      city: city || "",
      phone,
      email: normalizedEmail,
      timing: timing || "07:00 AM - 08:30 PM",
      description: description || "Full-service diagnostic center and clinical pathology.",
      accreditation: accreditation || "NABL & ICMR Approved",
      rating: rating ? Number(rating) : 4.8,
      features: parsedFeatures,
      status: status || "Active",
      commonKey: newLogin._id,
    });

    await newLab.save();

    return res.status(201).json({
      success: true,
      message: "Diagnostic Laboratory registered successfully",
      result: newLab,
    });
  } catch (error) {
    console.error("Error creating lab:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all labs (For Admin & User)
export const getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort({ createdAt: -1 });

    const labsWithCounts = await Promise.all(
      labs.map(async (lab) => {
        const testCount = await LabTest.countDocuments({
          $or: [{ labId: lab._id }, { labName: lab.name }],
          status: "Available",
        });
        const totalTests = await LabTest.countDocuments({
          $or: [{ labId: lab._id }, { labName: lab.name }],
        });
        const staffCount = await LabStaff.countDocuments({ labId: lab._id });
        const bookingCount = await LabBooking.countDocuments({
          $or: [{ labId: lab._id }, { labName: lab.name }],
        });

        return {
          ...lab.toObject(),
          testCount,
          totalTests,
          staffCount,
          bookingCount,
        };
      })
    );

    return res.status(200).json({ success: true, result: labsWithCounts });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single lab by ID (with tests & staff)
export const getLabById = async (req, res) => {
  try {
    const { id } = req.params;
    let lab = await Lab.findById(id).catch(() => null);
    if (!lab) {
      lab = await Lab.findOne({ commonKey: id });
    }

    if (!lab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    const tests = await LabTest.find({
      $or: [{ labId: lab._id }, { labName: lab.name }],
    }).sort({ createdAt: -1 });

    const staff = await LabStaff.find({ labId: lab._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      result: {
        lab,
        tests,
        staff,
      },
    });
  } catch (error) {
    console.error("Error fetching lab by ID:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Lab details (Admin or Lab)
export const updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingLab = await Lab.findById(id);
    if (!existingLab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    if (req.file) {
      updateData.image = req.file.filename;
    }

    if (updateData.features && typeof updateData.features === "string") {
      updateData.features = updateData.features.split(",").map((f) => f.trim()).filter(Boolean);
    }

    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
    }
    if (updateData.email && updateData.email !== existingLab.email) {
      const duplicateLab = await Lab.findOne({ email: updateData.email, _id: { $ne: id } });
      const duplicateLogin = await Login.findOne({
        username: updateData.email,
        ...(existingLab.commonKey ? { _id: { $ne: existingLab.commonKey } } : {}),
      });
      if (duplicateLab || duplicateLogin) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
    }

    // If password provided in update, update Login
    if (updateData.password) {
      if (!updateData.confirmPassword || updateData.password !== updateData.confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and Confirm Password do not match",
        });
      }
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      if (existingLab.commonKey) {
        await Login.findByIdAndUpdate(existingLab.commonKey, { password: hashedPassword });
      }
      delete updateData.password;
      delete updateData.confirmPassword;
    }

    // If email updated, also sync Login username
    if (updateData.email && updateData.email !== existingLab.email) {
      if (existingLab.commonKey) {
        await Login.findByIdAndUpdate(existingLab.commonKey, { username: updateData.email });
      }
    }

    const updatedLab = await Lab.findByIdAndUpdate(id, updateData, { new: true });

    // Sync labName in tests & bookings if name was modified
    if (updateData.name && updateData.name !== existingLab.name) {
      await LabTest.updateMany({ labId: id }, { labName: updateData.name });
      await LabBooking.updateMany({ labId: id }, { labName: updateData.name });
    }

    return res.status(200).json({
      success: true,
      message: "Lab details updated successfully",
      result: updatedLab,
    });
  } catch (error) {
    console.error("Error updating lab:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a Lab
export const deleteLab = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findById(id);
    if (!lab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    if (lab.commonKey) {
      await Login.findByIdAndDelete(lab.commonKey);
    }

    await LabTest.deleteMany({ $or: [{ labId: id }, { labName: lab.name }] });
    await LabStaff.deleteMany({ labId: id });
    await Lab.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Laboratory and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lab:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ================= LAB TEST CONTROLLERS =================

// Add new lab test (Lab Module or Admin)
export const addLabTest = async (req, res) => {
  try {
    const {
      labId,
      labName,
      testName,
      category,
      price,
      reportTime,
      preparation,
      description,
      status,
    } = req.body;

    if (!testName || !category || price === undefined) {
      return res.status(400).json({ success: false, message: "Test name, category and price are required" });
    }

    if (labId && !(await Lab.findById(labId))) {
      return res.status(404).json({ success: false, message: "Laboratory not found" });
    }

    let resolvedLabId = labId || null;
    let resolvedLabName = labName || "Diagnostic Lab";

    if (labId) {
      const foundLab = await Lab.findById(labId);
      if (foundLab) {
        resolvedLabName = foundLab.name;
      }
    } else {
      const firstLab = await Lab.findOne();
      if (firstLab) {
        resolvedLabId = firstLab._id;
        resolvedLabName = firstLab.name;
      }
    }

    const newTest = new LabTest({
      labId: resolvedLabId,
      labName: resolvedLabName,
      testName,
      category,
      price: Number(price),
      reportTime: reportTime || "24 Hours",
      preparation: preparation || "Fasting not required",
      description: description || "",
      status: status || "Available",
    });

    await newTest.save();
    return res.status(201).json({
      success: true,
      message: "Lab test added successfully",
      result: newTest,
    });
  } catch (error) {
    console.error("Error adding lab test:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all lab tests (with search and filters)
export const getAllLabTests = async (req, res) => {
  try {
    const { labId, category, search } = req.query;
    let filter = {};

    if (labId && labId !== "All") {
      filter.$or = [{ labId }, { labName: labId }];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { testName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { labName: { $regex: search, $options: "i" } },
      ];
    }

    const tests = await LabTest.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, result: tests });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get lab tests for a specific lab
export const getLabTestsByLab = async (req, res) => {
  try {
    const { labId } = req.params;
    const tests = await LabTest.find({
      $or: [{ labId }, { labName: labId }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, result: tests });
  } catch (error) {
    console.error("Error fetching lab tests for lab:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update lab test
export const updateLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.labId) {
      const foundLab = await Lab.findById(updateData.labId);
      if (foundLab) {
        updateData.labName = foundLab.name;
      }
    }

    const updated = await LabTest.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Lab test not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lab test updated successfully",
      result: updated,
    });
  } catch (error) {
    console.error("Error updating lab test:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Toggle test status (Available / Unavailable)
export const toggleLabTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await LabTest.findById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: "Lab test not found" });
    }
    test.status = test.status === "Available" ? "Unavailable" : "Available";
    await test.save();

    return res.status(200).json({
      success: true,
      message: `Test status set to ${test.status}`,
      result: test,
    });
  } catch (error) {
    console.error("Error toggling test status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete lab test
export const deleteLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LabTest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Lab test not found" });
    }
    return res.status(200).json({ success: true, message: "Lab test deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab test:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ================= LAB STAFF CONTROLLERS =================

// Add staff to a lab
export const addLabStaff = async (req, res) => {
  try {
    const { labId, name, phone, email, role, qualification, experience, status } = req.body;

    if (!labId || !name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Lab ID, staff name, phone, and email are required",
      });
    }

    if (!(await Lab.findById(labId))) {
      return res.status(404).json({ success: false, message: "Laboratory not found" });
    }

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const newStaff = new LabStaff({
      labId,
      name,
      phone,
      email,
      role: role || "Lab Technician",
      qualification: qualification || "",
      experience: experience || "",
      image,
      status: status || "Active",
    });

    await newStaff.save();
    return res.status(201).json({
      success: true,
      message: "Staff member added to laboratory successfully",
      result: newStaff,
    });
  } catch (error) {
    console.error("Error adding lab staff:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get staff for a specific lab
export const getLabStaff = async (req, res) => {
  try {
    const { labId } = req.params;
    const staff = await LabStaff.find({ labId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, result: staff });
  } catch (error) {
    console.error("Error fetching lab staff:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete staff from lab
export const deleteLabStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LabStaff.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    return res.status(200).json({ success: true, message: "Staff member removed successfully" });
  } catch (error) {
    console.error("Error deleting lab staff:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ================= USER BOOKING & REQUESTED VIEWS CONTROLLERS =================

// User books a lab test
export const bookLabTest = async (req, res) => {
  try {
    const {
      userId,
      patientName,
      phone,
      age,
      gender,
      address,
      bookingDate,
      bookingTime,
      labId,
      labName,
      testId,
      testName,
      category,
      price,
      attachmentType,
    } = req.body;

    if (!userId || !patientName || !phone || !bookingDate || !bookingTime || !testName) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required booking details",
      });
    }

    let resolvedLabId = labId || null;
    let resolvedLabName = labName || "Central Diagnostic Lab";

    if (labId) {
      const foundLab = await Lab.findById(labId);
      if (foundLab) {
        resolvedLabName = foundLab.name;
      }
    }

    let attachmentFile = null;
    if (req.file) {
      attachmentFile = req.file.filename;
    }

    const newBooking = new LabBooking({
      userId,
      patientName,
      phone,
      age: age ? Number(age) : null,
      gender: gender || "",
      address: address || "",
      bookingDate,
      bookingTime,
      labId: resolvedLabId,
      labName: resolvedLabName,
      testId: testId || null,
      testName,
      category: category || "General",
      price: price ? Number(price) : 0,
      attachmentFile,
      attachmentType: attachmentType || (req.file ? req.file.mimetype : ""),
      status: "Pending",
    });

    await newBooking.save();
    return res.status(201).json({
      success: true,
      message: `Test appointment booked successfully with ${resolvedLabName}!`,
      result: newBooking,
    });
  } catch (error) {
    console.error("Error booking lab test:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get bookings for a specific user
export const getUserLabBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await LabBooking.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, result: bookings });
  } catch (error) {
    console.error("Error fetching user lab bookings:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get requested bookings for a specific lab (or all for admin)
export const getLabBookings = async (req, res) => {
  try {
    const { labId } = req.params;
    const { status } = req.query;

    let filter = {};
    if (labId && labId !== "All") {
      filter.$or = [{ labId }, { labName: labId }];
    }
    if (status && status !== "All") {
      filter.status = status;
    }

    const bookings = await LabBooking.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, result: bookings });
  } catch (error) {
    console.error("Error fetching lab requests:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// All bookings for admin
export const getAllLabBookings = async (req, res) => {
  try {
    const { status, labId } = req.query;
    let query = {};
    if (status && status !== "All") {
      query.status = status;
    }
    if (labId && labId !== "All") {
      query.$or = [{ labId }, { labName: labId }];
    }

    const bookings = await LabBooking.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, result: bookings });
  } catch (error) {
    console.error("Error fetching all lab bookings:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!LabBooking.schema.path("status").enumValues.includes(status)) {
      return res.status(400).json({ success: false, message: "A valid booking status is required" });
    }

    const updated = await LabBooking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      result: updated,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lab uploads report to user
export const uploadLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, remarks } = req.body;

    const booking = await LabBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!result?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "A result or report file is required before completing the booking",
      });
    }

    booking.result = result?.trim() || "";
    booking.remarks = remarks?.trim() || "";

    if (req.file) {
      booking.reportFile = req.file.filename;
    }

    booking.status = "Completed";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Lab report uploaded and delivered to patient successfully!",
      result: booking,
    });
  } catch (error) {
    console.error("Error uploading lab report:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get stats for lab or admin
export const getLabStats = async (req, res) => {
  try {
    const { labId } = req.query;
    let filter = {};
    if (labId && labId !== "All") {
      filter.$or = [{ labId }, { labName: labId }];
    }

    const totalBookings = await LabBooking.countDocuments(filter);
    const pending = await LabBooking.countDocuments({ ...filter, status: "Pending" });
    const processing = await LabBooking.countDocuments({
      ...filter,
      status: { $in: ["Accepted", "Sample Collected", "Processing"] },
    });
    const completed = await LabBooking.countDocuments({ ...filter, status: "Completed" });

    let testsCount = 0;
    let staffCount = 0;
    if (labId && labId !== "All") {
      testsCount = await LabTest.countDocuments({ $or: [{ labId }, { labName: labId }] });
      staffCount = await LabStaff.countDocuments({ labId });
    } else {
      testsCount = await LabTest.countDocuments();
      staffCount = await LabStaff.countDocuments();
    }
    const totalLabs = await Lab.countDocuments();

    return res.status(200).json({
      success: true,
      result: {
        totalBookings,
        pending,
        processing,
        completed,
        totalLabs,
        totalTests: testsCount,
        totalStaff: staffCount,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
