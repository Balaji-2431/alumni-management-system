const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  approveEvent,
  deleteEvent
} = require("../controllers/eventController.js");
const upload = require("../middleware/upload");

const { protect } = require("../middleware/authMiddleware.js");
const { authorize } = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.post("/", protect,upload.uploadEventImage.single("image"), createEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);

router.put("/admin/:id/approve", protect, authorize("admin"), approveEvent);
router.delete("/:id", protect, deleteEvent);

module.exports =  router;

