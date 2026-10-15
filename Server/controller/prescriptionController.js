
import Prescription from "../modal/prescription.js";


export const prescriptionAdd = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, medicines } = req.body;

    if (
      !appointmentId ||
      !patientId ||
      !doctorId ||
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all prescription details",
      });
    }

    for (const item of medicines) {
      if (
        !item.medicine ||
        !item.dosage ||
        !item.duration ||
        !item.instruction
      ) {
        return res.status(400).json({
          message: "Please fill all fields for every medicine",
        });
      }
    }

    const prescriptionData = medicines.map((item) => ({
      appointmentId,
      patientId,
      doctorId,
      medicine: item.medicine,
      dosage: item.dosage,
      duration: item.duration,
      instruction: item.instruction,
    }));

    const prescriptions = await Prescription.insertMany(prescriptionData);

    return res.status(201).json({
      message: "Prescriptions saved successfully",
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPrescriptionAppointment = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      appointmentId: req.params.appointmentId,
    }).sort({ createdAt: 1 });

    if (prescriptions.length === 0) {
      return res.status(404).json({
        message: "No prescriptions found",
      });
    }

    return res.status(200).json({
      message: "Prescriptions retrieved successfully",
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Prescriptions retrieved successfully",
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updatePrescription = async (req, res) => {
  try {
    const { medicine, dosage, duration, instruction } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { medicine, dosage, duration, instruction },
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(
      req.params.id
    );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};