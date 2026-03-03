const express = require('express')
const router = express.Router()
const { getAllAlumni, getAlumniById, approveAlumni, deleteAlumni } = require('../controllers/adminController')
const { getAdminDashboard } = require('../controllers/adminDashboardController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect,authorize("admin"))

router.get("/alumni",getAllAlumni)
router.get("/alumni/:id",getAlumniById)
router.put("/alumni/:id/approve",approveAlumni)
router.delete("/alumni/:id",deleteAlumni)

router.get("/dashboard", getAdminDashboard)

module.exports = router