const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    createJob,
    getMyJobs,
    getAllJobs,
    getJobById,
    applyForJob,
    getMyApplications,
    getIndustryApplications,
    updateApplicationStatus
} = require("../controllers/jobController");

const router = express.Router();


// ==========================================
// INDUSTRY
// ==========================================

// Create job / internship

router.post(
    "/",
    protect,
    authorize("industry"),
    createJob
);


// Industry's own jobs

router.get(
    "/my-jobs",
    protect,
    authorize("industry"),
    getMyJobs
);


// Industry views applications

router.get(
    "/industry/applications",
    protect,
    authorize("industry"),
    getIndustryApplications
);


// Industry updates application status

router.put(
    "/applications/:applicationId/status",
    protect,
    authorize("industry"),
    updateApplicationStatus
);


// ==========================================
// STUDENT
// ==========================================

// Get all available jobs

router.get(
    "/",
    protect,
    authorize("student"),
    getAllJobs
);


// Get single job details

router.get(
    "/:jobId",
    protect,
    authorize("student"),
    getJobById
);


// Apply for job

router.post(
    "/:jobId/apply",
    protect,
    authorize("student"),
    applyForJob
);


// Student's applications

router.get(
    "/applications",
    protect,
    authorize("student"),
    getMyApplications
);


module.exports = router;