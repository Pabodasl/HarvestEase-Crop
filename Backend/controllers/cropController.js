const Crop = require("../models/cropModel");
const axios = require("axios");


const getAllCrops = async (req, res, next) => {
    try {
        const isAdmin = req.user && req.user.role === 'admin';
        const requestAll = req.query && req.query.scope === 'all';
        const query = (isAdmin || requestAll) ? {} : { userId: req.user._id };

        const crops = await Crop.find(query);

        if (!crops || crops.length === 0) {
            return res.status(200).json({ crops: [] });
        }

        const formattedCrops = crops.map(crop => ({
            _id: crop._id,
            farmerName: crop.farmerName,
            paddyType: crop.paddyType,
            plantedDate: crop.plantedDate.toISOString().split("T")[0],
            landArea: crop.landArea,
            phoneNumber: crop.phoneNumber,
            fertilizationDate: crop.fertilizationDate.toISOString().split("T")[0],
            harvestDate: crop.harvestDate.toISOString().split("T")[0]
        }));

        return res.status(200).json({ crops: formattedCrops });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch crops" });
    }
};


/// Data Insert with System Date Calculation
const addcrops = async (req, res, next) => {

    console.log("✅ Received submission data from frontend:", req.body);  // LOG DATA
    const { farmerName, paddyType, plantedDate, landArea, phoneNumber } = req.body;

    let crops;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Not authorized. Please log in again." });
        }

        const planted = new Date(plantedDate);  // Convert string to Date

        let fertilizationDate, harvestDate;

        // System calculation based on paddy type
        if (paddyType === "Nadu") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 15);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 90);
        } else if (paddyType === "Samba") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 20);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 120);
        } else if (paddyType === "Red Rice") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 18);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 110);
        } 
          else if (paddyType === "Bg 352") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 14);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 85);
    } else if (paddyType === "Suwandel") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 25);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 130);
    } else if (paddyType === "Pachchaperumal") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 22);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 125);
    }
        else {
            return res.status(400).json({ message: "Invalid paddy type" });
        }

        crops = new Crop({
            farmerName,
            paddyType,
            plantedDate,
            landArea,
            phoneNumber,
            fertilizationDate,
            harvestDate,
            userId: req.user && req.user._id
        });

        await crops.save();  // Data saved to MongoDB 
        
    } catch (err) {
        console.error("❌ Error saving crop data:", err);  // Log error clearly
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error while adding crops" });  // Respond with 500
        
    }

    if (!crops) {
        return res.status(404).json({ message: "Unable to add crops" });
    }

    return res.status(200).json({
        crops: {
            ...crops._doc,  // get all crop fields
            fertilizationDate: crops.fertilizationDate.toISOString().split("T")[0],
            harvestDate: crops.harvestDate.toISOString().split("T")[0],
            plantedDate: crops.plantedDate.toISOString().split("T")[0],
        }
    });
    
};


//Get by Id
const getById=async(req,res,next)=>{
   const id= req.params.id;
    let crop;

    try{
        crop=await Crop.findById(id);

}catch(err){
    console.log(err);
}

//not available crops
if(!crop){
    return res.status(404).json({message:"Crop not found."})

}
 // Format date fields
 const formattedCrop = {
    _id: crop._id,
    farmerName: crop.farmerName,
    paddyType: crop.paddyType,
    plantedDate: crop.plantedDate.toISOString().split("T")[0],
    landArea: crop.landArea,
    phoneNumber: crop.phoneNumber,
    fertilizationDate: crop.fertilizationDate.toISOString().split("T")[0],
    harvestDate: crop.harvestDate.toISOString().split("T")[0]
};
return res.status(200).json({ crop: formattedCrop });


};

// Update crop details with date recalculation
const updateCrop = async (req, res, next) => {
    const id = req.params.id;
    const { farmerName, paddyType, plantedDate, landArea, phoneNumber } = req.body;

    let fertilizationDate, harvestDate;

    try {
        const planted = new Date(plantedDate);

        // Date calculation based on paddy type
        if (paddyType === "Nadu") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 15);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 90);
        } else if (paddyType === "Samba") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 20);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 120);
        } else if (paddyType === "Red Rice") {
            fertilizationDate = new Date(planted);
            fertilizationDate.setDate(fertilizationDate.getDate() + 18);

            harvestDate = new Date(planted);
            harvestDate.setDate(harvestDate.getDate() + 110);
        } 
    else if (paddyType === "Bg 352") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 14);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 85);
    } else if (paddyType === "Suwandel") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 25);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 130);
    } else if (paddyType === "Pachchaperumal") {
        fertilizationDate = new Date(planted);
        fertilizationDate.setDate(fertilizationDate.getDate() + 22);

        harvestDate = new Date(planted);
        harvestDate.setDate(harvestDate.getDate() + 125);
    }
        else {
            return res.status(400).json({ message: "Invalid paddy type" });
        }

        // Update crop in database
        const updatedCrop = await Crop.findByIdAndUpdate(
            id,
            {
                farmerName,
                paddyType,
                plantedDate,
                landArea,
                phoneNumber,
                fertilizationDate,
                harvestDate,
            },
            { new: true }  // Return updated document
        );

        if (!updatedCrop) {
            return res.status(404).json({ message: "Unable to update crop details" });
        }

        // Format response
        const formattedCrop = {
            _id: updatedCrop._id,
            farmerName: updatedCrop.farmerName,
            paddyType: updatedCrop.paddyType,
            plantedDate: updatedCrop.plantedDate.toISOString().split("T")[0],
            landArea: updatedCrop.landArea,
            phoneNumber: updatedCrop.phoneNumber,
            fertilizationDate: updatedCrop.fertilizationDate.toISOString().split("T")[0],
            harvestDate: updatedCrop.harvestDate.toISOString().split("T")[0]
        };

        return res.status(200).json({ crop: formattedCrop });

    } catch (err) {
        console.log(err);
        
    }
};


// Delete crop details by ID
const deleteCrop = async (req, res, next) => {
    const id = req.params.id.trim();  // Trim to avoid newline issues

    let crop;

    try {
        crop = await Crop.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
   
    }

    if (!crop) {
        return res.status(404).json({ message: "Unable to delete crop. Crop not found." });
    }

    return res.status(200).json({ message: "Crop deleted successfully", crop });
};


exports.getAllCrops= getAllCrops;
exports.addcrops=addcrops;
exports.getById=getById;
exports.updateCrop=updateCrop;
exports.deleteCrop=deleteCrop;
