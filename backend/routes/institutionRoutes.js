const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getStudents,
    getApplicationStats
} = require("../controllers/institutionController");

const router = express.Router();


// ==========================================
// INSTITUTION DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    protect,
    authorize("institution"),
    getDashboardStats
);


// ==========================================
// VIEW STUDENTS
// ==========================================

router.get(
    "/students",
    protect,
    authorize("institution"),
    getStudents
);


// ==========================================
// APPLICATION STATISTICS
// ==========================================

router.get(
    "/applications/stats",
    protect,
    authorize("institution"),
    getApplicationStats
);


module.exports = router;