const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    getRecommendedJobs
} = require("../controllers/matchingController");

const router = express.Router();


// ==========================================
// STUDENT JOB RECOMMENDATIONS
// ==========================================

router.get(
    "/recommended",
    protect,
    authorize("student"),
    getRecommendedJobs
);


module.exports = router;