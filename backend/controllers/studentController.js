const db = require("../config/db");


// ==========================================
// GET STUDENT PROFILE
// ==========================================

const getProfile = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const [students] =
            await db.query(
                `SELECT
                    s.id AS student_id,
                    u.id AS user_id,
                    u.name,
                    u.email,
                    s.university,
                    s.course,
                    s.year,
                    s.resume

                 FROM students s

                 JOIN users u
                    ON s.user_id = u.id

                 WHERE s.user_id = ?`,
                [userId]
            );


        if (students.length === 0) {

            return res.status(404).json({

                message:
                    "Student profile not found"
            });
        }


        res.json({

            message:
                "Student profile fetched successfully",

            profile:
                students[0]
        });


    } catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch student profile",

            error:
                error.message
        });
    }
};


// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const {
            university,
            course,
            year,
            resume
        } = req.body;


        const [students] =
            await db.query(
                `SELECT id
                 FROM students
                 WHERE user_id = ?`,
                [userId]
            );


        if (students.length === 0) {

            return res.status(404).json({

                message:
                    "Student profile not found"
            });
        }


        await db.query(
            `UPDATE students
             SET
                university = ?,
                course = ?,
                year = ?,
                resume = ?
             WHERE user_id = ?`,
            [
                university || null,
                course || null,
                year || null,
                resume || null,
                userId
            ]
        );


        res.json({

            message:
                "Student profile updated successfully"
        });


    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update student profile",

            error:
                error.message
        });
    }
};


// ==========================================
// GET STUDENT SKILL PROFILE
// ==========================================

const getSkillProfile = async (req, res) => {

    try {

        const userId =
            req.user.id;


        // ------------------------------------------
        // FIND STUDENT
        // ------------------------------------------

        const [students] =
            await db.query(
                `SELECT
                    id
                 FROM students
                 WHERE user_id = ?`,
                [userId]
            );


        if (students.length === 0) {

            return res.status(404).json({

                message:
                    "Student profile not found"
            });
        }


        const studentId =
            students[0].id;


        // ------------------------------------------
        // GET ASSESSMENT SKILLS
        // ------------------------------------------

        const [skills] =
            await db.query(
                `SELECT
                    ar.skill_id,
                    s.name AS skill_name,
                    s.category,
                    ar.score,

                    CASE
                        WHEN ar.score >= 80 THEN 5
                        WHEN ar.score >= 60 THEN 4
                        WHEN ar.score >= 40 THEN 3
                        WHEN ar.score >= 20 THEN 2
                        ELSE 1
                    END AS proficiency

                 FROM assessment_results ar

                 JOIN skills s
                    ON ar.skill_id = s.id

                 WHERE ar.student_id = ?

                 ORDER BY ar.score DESC`,
                [studentId]
            );


        // ------------------------------------------
        // CALCULATE OVERALL SCORE
        // ------------------------------------------

        let overallScore = 0;


        if (skills.length > 0) {

            const totalScore =
                skills.reduce(
                    (total, skill) =>
                        total +
                        Number(skill.score),
                    0
                );


            overallScore =
                Math.round(
                    totalScore /
                    skills.length
                );
        }


        // ------------------------------------------
        // SKILL CATEGORIES
        // ------------------------------------------

        const strongSkills = [];

        const developingSkills = [];

        const weakSkills = [];


        for (const skill of skills) {

            const skillData = {

                skill_id:
                    skill.skill_id,

                skill_name:
                    skill.skill_name,

                category:
                    skill.category,

                score:
                    Number(skill.score),

                proficiency:
                    Number(skill.proficiency)
            };


            if (Number(skill.score) >= 80) {

                strongSkills.push(
                    skillData
                );

            } else if (
                Number(skill.score) >= 50
            ) {

                developingSkills.push(
                    skillData
                );

            } else {

                weakSkills.push(
                    skillData
                );
            }
        }


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.json({

            message:
                "Student skill profile fetched successfully",

            skill_profile: {

                overall_score:
                    overallScore,

                total_skills:
                    skills.length,

                strong_skills:
                    strongSkills,

                developing_skills:
                    developingSkills,

                weak_skills:
                    weakSkills,

                all_skills:
                    skills
            }
        });


    } catch (error) {

        console.error(
            "Get Skill Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch skill profile",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getProfile,

    updateProfile,

    getSkillProfile
};