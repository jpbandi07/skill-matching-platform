const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
    getProfile,
    updateProfile,
    getSkillProfile
} = require("../controllers/studentController");

const router = express.Router();


// ==========================================
// STUDENT AUTHENTICATION TEST
// ==========================================

router.get(
    "/test",
    protect,
    authorize("student"),
    (req, res) => {

        res.json({

            message:
                "You are authenticated!",

            user:
                req.user
        });
    }
);


// ==========================================
// STUDENT PROFILE
// ==========================================

router.get(
    "/profile",
    protect,
    authorize("student"),
    getProfile
);


router.put(
    "/profile",
    protect,
    authorize("student"),
    updateProfile
);


// ==========================================
// STUDENT SKILL PROFILE
// ==========================================

router.get(
    "/skills",
    protect,
    authorize("student"),
    getSkillProfile
);


module.exports = router;