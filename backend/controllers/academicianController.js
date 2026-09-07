const db = require("../config/db");


// ==========================================
// GET ALL STUDENTS
// ==========================================

const getAllStudents = async (req, res) => {
    try {

        const [students] = await db.query(`
            SELECT
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
            ORDER BY u.name
        `);


        res.json({

            message:
                "Students fetched successfully",

            total_students:
                students.length,

            students:
                students
        });


    } catch (error) {

        console.error(
            "Get All Students Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch students",

            error:
                error.message
        });
    }
};


// ==========================================
// GET STUDENT SKILL PROFILE
// ==========================================

const getStudentSkillProfile = async (req, res) => {
    try {

        const studentId =
            Number(req.params.studentId);


        // ------------------------------------------
        // GET STUDENT
        // ------------------------------------------

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
                 WHERE s.id = ?`,
                [studentId]
            );


        if (students.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found"
            });
        }


        const student =
            students[0];


        // ------------------------------------------
        // GET ASSESSMENT RESULTS
        // ------------------------------------------

        const [skills] =
            await db.query(
                `SELECT
                    ar.skill_id,
                    s.name AS skill_name,
                    s.category,
                    ar.score
                 FROM assessment_results ar
                 JOIN skills s
                    ON ar.skill_id = s.id
                 WHERE ar.student_id = ?
                 ORDER BY ar.score DESC`,
                [studentId]
            );


        // ------------------------------------------
        // CALCULATE SKILL ANALYSIS
        // ------------------------------------------

        const strongSkills = [];

        const developingSkills = [];

        const weakSkills = [];


        for (const skill of skills) {

            const score =
                Number(skill.score);


            if (score >= 80) {

                strongSkills.push({

                    skill_id:
                        skill.skill_id,

                    skill_name:
                        skill.skill_name,

                    category:
                        skill.category,

                    score:
                        score
                });

            } else if (score >= 50) {

                developingSkills.push({

                    skill_id:
                        skill.skill_id,

                    skill_name:
                        skill.skill_name,

                    category:
                        skill.category,

                    score:
                        score
                });

            } else {

                weakSkills.push({

                    skill_id:
                        skill.skill_id,

                    skill_name:
                        skill.skill_name,

                    category:
                        skill.category,

                    score:
                        score
                });
            }
        }


        // ------------------------------------------
        // OVERALL SCORE
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
        // RESPONSE
        // ------------------------------------------

        res.json({

            message:
                "Student skill analysis fetched successfully",

            student: {

                student_id:
                    student.student_id,

                user_id:
                    student.user_id,

                name:
                    student.name,

                email:
                    student.email,

                university:
                    student.university,

                course:
                    student.course,

                year:
                    student.year,

                resume:
                    student.resume
            },


            skill_analysis: {

                overall_score:
                    overallScore,

                total_skills_assessed:
                    skills.length,

                strong_skills:
                    strongSkills,

                developing_skills:
                    developingSkills,

                weak_skills:
                    weakSkills
            },


            all_skills:
                skills
        });


    } catch (error) {

        console.error(
            "Get Student Skill Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch student skill profile",

            error:
                error.message
        });
    }
};


// ==========================================
// GET ACADEMICIAN DASHBOARD
// ==========================================

const getDashboardStats = async (req, res) => {
    try {

        // ------------------------------------------
        // TOTAL STUDENTS
        // ------------------------------------------

        const [studentCount] =
            await db.query(
                `SELECT COUNT(*) AS total_students
                 FROM students`
            );


        // ------------------------------------------
        // STUDENTS WHO COMPLETED ASSESSMENT
        // ------------------------------------------

        const [assessmentCount] =
            await db.query(
                `SELECT COUNT(DISTINCT student_id)
                 AS assessed_students
                 FROM assessment_results`
            );


        // ------------------------------------------
        // TOTAL SKILLS
        // ------------------------------------------

        const [skillCount] =
            await db.query(
                `SELECT COUNT(*) AS total_skills
                 FROM skills`
            );


        // ------------------------------------------
        // AVERAGE SKILL SCORE
        // ------------------------------------------

        const [averageScore] =
            await db.query(
                `SELECT
                    ROUND(AVG(score), 2)
                    AS average_score
                 FROM assessment_results`
            );


        // ------------------------------------------
        // SKILL PERFORMANCE
        // ------------------------------------------

        const [skillPerformance] =
            await db.query(
                `SELECT
                    s.id AS skill_id,
                    s.name AS skill_name,
                    s.category,
                    ROUND(AVG(ar.score), 2)
                    AS average_score,
                    COUNT(ar.student_id)
                    AS students_assessed
                 FROM assessment_results ar
                 JOIN skills s
                    ON ar.skill_id = s.id
                 GROUP BY
                    s.id,
                    s.name,
                    s.category
                 ORDER BY average_score DESC`
            );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.json({

            message:
                "Academician dashboard statistics fetched successfully",

            statistics: {

                total_students:
                    Number(
                        studentCount[0].total_students
                    ),

                assessed_students:
                    Number(
                        assessmentCount[0].assessed_students
                    ),

                total_skills:
                    Number(
                        skillCount[0].total_skills
                    ),

                average_skill_score:
                    averageScore[0].average_score === null
                        ? 0
                        : Number(
                            averageScore[0].average_score
                        )
            },


            skill_performance:
                skillPerformance
        });


    } catch (error) {

        console.error(
            "Academician Dashboard Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch academician dashboard statistics",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getAllStudents,

    getStudentSkillProfile,

    getDashboardStats
};