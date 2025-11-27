const express = require("express");
const router = express.Router();

// Correct import path (case-sensitive)
const cropController = require("../controllers/cropController");
const { protect } = require("../middlewares/auth");

// Route for getting all crops
router.get("/", protect, cropController.getAllCrops);
router.post("/add", protect, cropController.addcrops);
router.get("/:id", protect, cropController.getById);
router.put("/update/:id", protect, cropController.updateCrop);
router.delete("/delete/:id", protect, cropController.deleteCrop);


// Export router
module.exports = router;
