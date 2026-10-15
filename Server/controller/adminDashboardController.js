import User from "../modal/user.js";
import Doctor from "../modal/doctor.js";
import Staff from "../modal/staff.js";
import Appointment from "../modal/appointment.js";
import MedicineOrder from "../modal/medicineOrder.js";
import Companion from "../modal/companion.js";
import EquipmentBooking from "../modal/equipmentbooking.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalStaff = await Staff.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending",
    });

    const acceptedAppointments = await Appointment.countDocuments({
      status: "Accepted",
    });

    const rejectedAppointments = await Appointment.countDocuments({
      status: "Rejected",
    });

    const medicineOrders = await MedicineOrder.countDocuments();

    const companionRequests = await Companion.countDocuments();

    const equipmentBookings = await EquipmentBooking.countDocuments();

    const recentAppointments = await Appointment.find()
  .populate("doctorId", "name specialization")
  .sort({ createdAt: -1 })
  .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalDoctors,
        totalStaff,
        totalAppointments,
        pendingAppointments,
        acceptedAppointments,
        rejectedAppointments,
        medicineOrders,
        companionRequests,
        equipmentBookings,
      },

      recentAppointments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};