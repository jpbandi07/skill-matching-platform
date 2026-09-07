const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    getQuestions,
    submitAssessment,
    getResults
} = require("../controllers/assessmentController");

const router = express.Router();


// ==========================================
// GET SELF-ASSESSMENT QUESTIONS
// ==========================================

router.get(
    "/questions",
    protect,
    authorize("student"),
    getQuestions
);


// ==========================================
// SUBMIT SELF-ASSESSMENT
// ==========================================

router.post(
    "/submit",
    protect,
    authorize("student"),
    submitAssessment
);


// ==========================================
// GET ASSESSMENT RESULTS
// ==========================================

router.get(
    "/results",
    protect,
    authorize("student"),
    getResults
);


module.exports = router;