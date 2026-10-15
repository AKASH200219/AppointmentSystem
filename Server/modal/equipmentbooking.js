
import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
  },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
    image:{
      type:String,
      required:true,
    },
    equipmentName: {
      type: String,
      required: true},
    equipmentType: {
      type: String,
      required: true},
    rentprice: {
      type: Number,
      required: true},
    quantity: { 
        type: Number,
         required: true,
          min: 1, },
    totalRent:{
      type:Number,
      required:true,
    },
      days: {
   type: Number,
   required: true,
},
    status: {
  type: String,
  enum: ["Pending", "Accepted", "Cancelled"],
  default: "Pending"
}
  },
  {
    timestamps: true,
  }
);

const EquipmentBooking = mongoose.model("EquipmentBooking", equipmentSchema);

export default EquipmentBooking;