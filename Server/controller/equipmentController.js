import Equipment from "../modal/equipment.js";
import EquipmentBooking from "../modal/equipmentbooking.js";
import User from "../modal/user.js";

export const addEquipment = async (req, res) => {
  try {

    const {name,type,rentprice,quantity,information } = req.body;

    if (!req.file) {
      return res.status(400).json({message: "Please upload equipment image"});
    }

    if (!name ||!type||!rentprice ||!quantity ||!information) {
      return res.status(400).json({message: "Please fill all fields"});
    }

    const equipment = new Equipment({
      image: req.file.filename,
      name: name,
      type: type,
      rentprice:rentprice,
      quantity: quantity,
      information: information

    });

    await equipment.save();

    res.status(201).json({

      message: "Equipment added successfully", equipment: equipment });

  } 
  catch (error) {

    console.log(error,"Failed to add equipment");

    res.status(500).json({message: "Server error",error: error.message});

  }
};

export const getEquipForEdit = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Equipment ID:", id);

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    return res.status(200).json({
      message: "Equipment found",
      equipment: equipment
    });

  } catch (err) {
    console.log("Error to get:", err);

    return res.status(500).json({
      message: "Error to get Equipment"
    });
  }
};


























export const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Equipment fetched successfully",
      equipment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to get equipment",
      error: error.message,
    });
  }
};

// export const BookingEquip = async(req,res)=>{
//   try{
//     const {id} = req.params;
//     const {userId,equipmentId,quantity,totalRent} = req.body;
//     console.log("Booking Equipment ID:", id);
//      console.log("Requested Quantity:", quantity)
//     const equipment = await Equipment.findById({_id:id});
//     console.log("Equipment found:", equipment);
//     if (!equipment) {
//       return res.status(404).json({message:"Equipment not found"});
//     }
//     if (!quantity || quantity < 1) {
//       return res.status(400).json({
//         message: "Please select a valid quantity",
//       });
//     }
//     const equipmentBooking = new EquipmentBooking ({
//       userId,
//       equipmentId,
//       equipmentName: equipment.name,
//       equipmentType: equipment.type,
//       rentprice: equipment.rentprice,
//       quantity: Number(quantity),
//       totalRent:totalRent
//     });
//     await equipmentBooking.save();
    


//     return res.status(200).json({message:"Equipment booked successfully"})
    
//   }
//   catch(err){
//     console.log("Failed to submit the equipment",err);
//     return res.status(400).json({message:"Failed to Submit"})
    
//   }


// }


export const BookingEquip = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, equipmentId, quantity, days } = req.body;

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    // Find User using commonKey
    const user = await User.findOne({
      commonKey: userId
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const totalRent =
      Number(quantity) *
      Number(days) *
      Number(equipment.rentprice);

    const equipmentBooking = new EquipmentBooking({
      userId: user._id,   
      equipmentId: equipment._id,
      equipmentName: equipment.name,
      equipmentType: equipment.type,
      image: equipment.image,
      rentprice: Number(equipment.rentprice),
      quantity: Number(quantity),
      days: Number(days),
      totalRent: totalRent,
      status: "Pending"
    });

    await equipmentBooking.save();

    res.status(200).json({
      message: "Equipment booked successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to submit equipment booking",
      error: error.message
    });
  }
};


export const getAllEquipmentBookings = async (req, res) => {
  try {
    const bookings = await EquipmentBooking.find()
      .populate("userId")
      .populate("equipmentId")
      .sort({ createdAt: -1 });
      console.log("Booking",bookings);
      

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings,
    });

  } catch (error) {
    console.log("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to get bookings",
      error: error.message,
    });
  }
};

export const updateEquipmentBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Booking ID:", id);
    console.log("New Status:", status);

    const booking = await EquipmentBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    console.log("Updated Booking:", booking);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Status updated",
      booking,
    });

  } catch (error) {
    console.log("Update error:", error);

    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};



export const updateEquipment = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, type, rentprice, pricePerDay, quantity, information } = req.body;

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    equipment.name = name;
    equipment.type = type;
    equipment.rentprice = rentprice;
    equipment.pricePerDay = pricePerDay;
    equipment.quantity = quantity;
    equipment.information = information;

    if (req.file) {
      equipment.image = req.file.filename;
    }

    await equipment.save();

    res.status(200).json({
      message: "Equipment updated successfully",
      equipment: equipment
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Unable to update equipment",
      error: error.message
    });

  }
};


export const deleteEquipment = async (req, res) => {
  try {

    const { id } = req.params;

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found"
      });
    }

    await Equipment.findByIdAndDelete(id);

    res.status(200).json({
      message: "Equipment deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Unable to delete equipment",
      error: error.message
    });

  }
};




export const equipmentbookedstatus = async (req, res) => {
  try {

    const { userId } = req.params;

    console.log("Common Key from frontend:", userId);


    // Find user using commonKey
    const user = await User.findOne({
      commonKey: userId
    });

    console.log("User found:", user);


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    // Find bookings using actual User _id
    const bookings = await EquipmentBooking.find({
      userId: user._id
    })
      .populate("equipmentId")
      .sort({ createdAt: -1 });


    console.log("Actual User MongoDB ID:", user._id);
    console.log("BOOKINGS FOUND:", bookings);


    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings
    });


  } catch (error) {

    console.log("Error:", error);

    res.status(500).json({
      message: "Unable to get bookings",
      error: error.message
    });

  }
};

