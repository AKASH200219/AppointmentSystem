import Doctor from "../modal/doctor.js";
import Token from "../modal/token.js";

const isValidMonth = (month) => {
  if (typeof month !== "string") return false;

  const parts = month.split("-");

  if (parts.length !== 2 || parts[0].length !== 4) {
    return false;
  }

  const year = Number(parts[0]);
  const monthNumber = Number(parts[1]);

  return (
    Number.isInteger(year) &&
    Number.isInteger(monthNumber) &&
    monthNumber >= 1 &&
    monthNumber <= 12
  );
};

// Set daily tokens for every day in the selected month
export const setCommonTokens = async (req, res) => {
  try {
    const { month, token } = req.body;
    const tokenLimit = Number(token);

    if (!isValidMonth(month) || !Number.isInteger(tokenLimit) || tokenLimit < 1) {
      return res.status(400).json({
        message: "Enter a valid month and a positive whole-number token limit",
      });
    }

    const doctors = await Doctor.find({}, { _id: 1 });

    if (doctors.length === 0) {
      return res.status(404).json({
        message: "No doctors are available",
      });
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const daysInMonth = new Date(year, monthNumber, 0).getDate();

    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(`${month}-${String(day).padStart(2, "0")}`);
    }

    const existingTokens = await Token.find({ month });

    const overbooked = existingTokens.find(
      (record) => tokenLimit < record.bookedtoken
    );

    if (overbooked) {
      return res.status(400).json({
        message: `Cannot set the limit below the ${overbooked.bookedtoken} bookings on ${overbooked.date}.`,
      });
    }

    const operations = [];

    for (const doctor of doctors) {
      for (const date of dates) {
        operations.push({
          updateOne: {
            filter: {
              doctorId: doctor._id,
              date,
            },
            update: {
              $set: {
                month,
                token: tokenLimit,
              },
              $setOnInsert: {
                doctorId: doctor._id,
                date,
                bookedtoken: 0,
              },
            },
            upsert: true,
          },
        });
      }
    }

    await Token.bulkWrite(operations);

    const tokenData = await Token.find({ month })
      .populate("doctorId", "name")
      .sort({ date: 1 });

    return res.status(200).json({
      message: "Daily tokens saved successfully for the selected month",
      tokenData,
    });
  } catch (error) {
    console.error("Set tokens error:", error);

    return res.status(500).json({
      message: "Failed to save daily tokens",
    });
  }
};

// Get daily token records for a doctor
export const getTokens = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const tokenData = await Token.find({ doctorId }).sort({
      date: 1,
    });

    return res.status(200).json({ tokenData });
  } catch (error) {
    console.error("Get tokens error:", error);

    return res.status(500).json({
      message: "Failed to get tokens",
    });
  }
};

// Get daily records for a selected month
export const getCommonTokens = async (req, res) => {
  try {
    const { month } = req.params;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        message: "Provide a valid month",
      });
    }

    const tokenData = await Token.find({ month })
      .populate("doctorId", "name")
      .sort({ date: 1 });

    return res.status(200).json({ tokenData });
  } catch (error) {
    console.error("Get monthly tokens error:", error);

    return res.status(500).json({
      message: "Failed to get monthly token records",
    });
  }
};