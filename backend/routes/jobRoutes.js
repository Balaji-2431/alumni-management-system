const express = require('express')
const {
  createJob,
  getJobs,
  getJobById,
  approveJob,
  deleteJob
} = require("../controllers/jobController.js");
const upload = require("../middleware/upload");


const { protect } = require("../middleware/authMiddleware.js");
const { authorize } = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);
router.post("/", protect,upload.uploadJobImage.single("image"), createJob);

router.put("/admin/:id/approve", protect, authorize("admin"), approveJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;

