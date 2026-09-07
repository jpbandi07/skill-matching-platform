const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getRecommendedCourses
} = require("../controllers/courseController");

const router = express.Router();

router.get(
    "/recommended",
    protect,
    authorize("student"),
    getRecommendedCourses
);

module.exports = router;