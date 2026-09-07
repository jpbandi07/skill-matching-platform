const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    getAllStudents,
    getStudentSkillProfile,
    getDashboardStats
} = require("../controllers/academicianController");

const router = express.Router();


// ==========================================
// ACADEMICIAN DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    protect,
    authorize("academician"),
    getDashboardStats
);


// ==========================================
// VIEW ALL STUDENTS
// ==========================================

router.get(
    "/students",
    protect,
    authorize("academician"),
    getAllStudents
);


// ==========================================
// VIEW STUDENT SKILL PROFILE
// ==========================================

router.get(
    "/students/:studentId",
    protect,
    authorize("academician"),
    getStudentSkillProfile
);


module.exports = router;