import Doctor from "../modal/doctor.js";


export const doctorinfo=async(req,res)=>{
    try{
        const doctorData=await Doctor.find();
        return res.status(200).json({message:"Doctor info fetched successfully",doctorData})
    }
    catch(err){
        console.log("Can't get Doctor info",err);
        return res.status(500).json({message:"Failed to fetch doctor info"})
    }
}

export const docbook = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorData = await Doctor.findById(id);

    console.log("Doctor Booking Info:", doctorData);

    return res.status(200).json({message: "Doctor info fetched successfully",doctorData});

  } 
  catch (err) {
    console.log("Failed to get information about doctor", err);

    return res.status(500).json({message: "Failed to fetch doctor info"});
  }
};