const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cropSchema = new schema({
    farmerName: {
        type: String,
        required: [true, "Farmer name is required"],
        trim: true,
    },
    paddyType: {
        type: String,
        required: [true, "Paddy type is required"],
        enum: ["Nadu", "Samba", "Red Rice", "Bg 352", "Suwandel", "Pachchaperumal"],
    },
    plantedDate: {
        type: Date,
        required: [true, "Planted date is required"],
    },
    landArea: {
        type: Number,
        required: [true, "Land area is required"],
        min: [0.1, "Land area must be at least 0.1 acres"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^0\d{9}$/, "Invalid phone number format"],
    },
    fertilizationDate: {
        type: Date,
    },
    harvestDate: {
        type: Date,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Crop", cropSchema);