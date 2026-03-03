const express = require("express");
const router = express.Router();
const { getAlumniDashboard } = require("../controllers/alumniDashboardController");
const { protect } = require('../middleware/authMiddleware')

router.get("/dashboard", protect, getAlumniDashboard);

module.exports = router;
