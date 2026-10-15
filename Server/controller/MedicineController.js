import mongoose from "mongoose";
import Medicine from "../modal/medicine.js";
import MedicineOrder from "../modal/medicineOrder.js";
import User from "../modal/user.js";


export const addMedicine = async (req, res) => {
  try {
    const { name, genericName, category, manufacturer, dosage, price, quantity, expiryDate, description } = req.body;

    if (!name || !category || !price || quantity === undefined) {
      return res.status(400).json({ message: "Please fill all required fields (Name, Category, Price, Quantity)" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a medicine image" });
    }

    const medicine = new Medicine({
      name,
      genericName: genericName || "",
      category,
      manufacturer: manufacturer || "",
      dosage: dosage || "",
      price: Number(price),
      quantity: Number(quantity),
      expiryDate: expiryDate || "",
      description: description || "",
      image: req.file.filename,
    });

    await medicine.save();

    res.status(201).json({ message: "Medicine added successfully", medicine, });
  }
  catch (error) {
    console.log("Failed to add medicine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Medicines fetched successfully", medicines, });
  } catch (error) {
    console.log("Error fetching medicines:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine fetched successfully", medicine, });
  } catch (error) {
    console.log("Error fetching medicine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Medicine
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genericName, category, manufacturer, dosage, price, quantity, expiryDate, description } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.name = name || medicine.name;
    medicine.genericName = genericName !== undefined ? genericName : medicine.genericName;
    medicine.category = category || medicine.category;
    medicine.manufacturer = manufacturer !== undefined ? manufacturer : medicine.manufacturer;
    medicine.dosage = dosage !== undefined ? dosage : medicine.dosage;
    if (price !== undefined) medicine.price = Number(price);
    if (quantity !== undefined) medicine.quantity = Number(quantity);
    medicine.expiryDate = expiryDate !== undefined ? expiryDate : medicine.expiryDate;
    medicine.description = description !== undefined ? description : medicine.description;

    if (req.file) {
      medicine.image = req.file.filename;
    }

    await medicine.save();

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    console.log("Error updating medicine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await Medicine.findByIdAndDelete(id);

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.log("Error deleting medicine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const orderMedicine = async (req, res) => {
  try {
    const { userId, medicineId, quantity, address, phone } = req.body;

    if (!userId || !medicineId || !quantity || !address || !phone) {
      return res.status(400).json({ message: "Please fill all fields (userId, medicineId, quantity, address, phone)" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.quantity < Number(quantity)) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    // Find User by commonKey or _id
    let user = await User.findOne({ commonKey: userId });
    if (!user) {
      user = await User.findById(userId).catch(() => null);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalPrice = Number(quantity) * Number(medicine.price);

    const newOrder = new MedicineOrder({
      userId: user._id,
      medicineId: medicine._id,
      image: medicine.image,
      medicineName: medicine.name,
      category: medicine.category,
      price: medicine.price,
      quantity: Number(quantity),
      totalPrice,
      address,
      phone,
      status: "Pending",
    });

    await newOrder.save();

    // Deduct stock quantity
    medicine.quantity -= Number(quantity);
    await medicine.save();

    res.status(201).json({
      message: "Medicine order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Error ordering medicine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Orders for User
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findOne({ commonKey: userId });
    if (!user) {
      user = await User.findById(userId).catch(() => null);
    }

    const queryConditions = [];
    if (user) {
      queryConditions.push({ userId: user._id });
    }
    if (mongoose.Types.ObjectId.isValid(userId)) {
      queryConditions.push({ userId: userId });
    }

    const query = queryConditions.length > 0 ? { $or: queryConditions } : { userId };

    const orders = await MedicineOrder.find(query)
      .populate("medicineId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await MedicineOrder.find()
      .populate("userId")
      .populate("medicineId")
      .sort({ createdAt: -1 });
    console.log("All Orders:", orders);

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await MedicineOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const prescriptionByorder = async (req, res) => {
  try {
    const { userId, phone } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Prescription PDF is required"
      });
    }

    const newOrder = new MedicineOrder({
      userId: userId,
      phone: phone,
      prescription: req.file.filename,
      status: "Pending",
    });

    await newOrder.save();

    console.log("User ID:", userId);
    console.log("Prescription:", req.file);

    res.status(201).json({
      message: "Prescription uploaded successfully",
      file: req.file.filename
    });

  } catch (error) {
    console.log("Prescription upload error:", error);
    res.status(500).json({
      message: "Failed to upload prescription",
      error: error.message
    });
  }
};


export const getPrescriptionFile = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await MedicineOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.prescription) {
      return res.status(404).json({ message: "Prescription not found for this order" });
    }

    const prescriptionFilePath = `uploads/${order.prescription}`;
    res.download(prescriptionFilePath, order.prescription, (err) => {
      if (err) {
        console.log("Error downloading prescription:", err);
        res.status(500).json({ message: "Failed to download prescription", error: err.message });
      }
    });
  } catch (error) {
    console.log("Error fetching prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

