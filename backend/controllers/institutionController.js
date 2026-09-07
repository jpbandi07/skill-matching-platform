const db = require("../config/db");


// ==========================================
// GET INSTITUTION DASHBOARD
// ==========================================

const getDashboardStats = async (req, res) => {
    try {

        // ------------------------------------------
        // TOTAL STUDENTS
        // ------------------------------------------

        const [studentCount] = await db.query(
            `SELECT COUNT(*) AS total_students
             FROM students`
        );


        // ------------------------------------------
        // STUDENTS WHO COMPLETED ASSESSMENT
        // ------------------------------------------

        const [assessedCount] = await db.query(
            `SELECT COUNT(DISTINCT student_id)
             AS assessed_students
             FROM assessment_results`
        );


        // ------------------------------------------
        // TOTAL JOBS
        // ------------------------------------------

        const [jobCount] = await db.query(
            `SELECT COUNT(*) AS total_jobs
             FROM jobs`
        );


        // ------------------------------------------
        // TOTAL INTERNSHIPS
        // ------------------------------------------

        const [internshipCount] = await db.query(
            `SELECT COUNT(*) AS total_internships
             FROM jobs
             WHERE type = 'internship'`
        );


        // ------------------------------------------
        // TOTAL APPLICATIONS
        // ------------------------------------------

        const [applicationCount] = await db.query(
            `SELECT COUNT(*) AS total_applications
             FROM applications`
        );


        // ------------------------------------------
        // SELECTED STUDENTS
        // ------------------------------------------

        const [selectedCount] = await db.query(
            `SELECT COUNT(*) AS selected_students
             FROM applications
             WHERE status = 'selected'`
        );


        // ------------------------------------------
        // SHORTLISTED APPLICATIONS
        // ------------------------------------------

        const [shortlistedCount] = await db.query(
            `SELECT COUNT(*) AS shortlisted_applications
             FROM applications
             WHERE status = 'shortlisted'`
        );


        // ------------------------------------------
        // INTERVIEW APPLICATIONS
        // ------------------------------------------

        const [interviewCount] = await db.query(
            `SELECT COUNT(*) AS interview_applications
             FROM applications
             WHERE status = 'interview'`
        );


        // ------------------------------------------
        // REJECTED APPLICATIONS
        // ------------------------------------------

        const [rejectedCount] = await db.query(
            `SELECT COUNT(*) AS rejected_applications
             FROM applications
             WHERE status = 'rejected'`
        );


        // ------------------------------------------
        // AVERAGE SKILL SCORE
        // ------------------------------------------

        const [averageSkill] = await db.query(
            `SELECT
                ROUND(AVG(score), 2)
                AS average_skill_score
             FROM assessment_results`
        );


        // ------------------------------------------
        // SKILL PERFORMANCE
        // ------------------------------------------

        const [skillPerformance] = await db.query(
            `SELECT
                s.id AS skill_id,
                s.name AS skill_name,
                s.category,
                ROUND(AVG(ar.score), 2)
                AS average_score,
                COUNT(DISTINCT ar.student_id)
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
        // APPLICATION STATUS SUMMARY
        // ------------------------------------------

        const [applicationStatus] = await db.query(
            `SELECT
                status,
                COUNT(*) AS total
             FROM applications
             GROUP BY status`
        );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.json({

            message:
                "Institution dashboard statistics fetched successfully",

            statistics: {

                total_students:
                    Number(
                        studentCount[0].total_students
                    ),

                assessed_students:
                    Number(
                        assessedCount[0].assessed_students
                    ),

                total_jobs:
                    Number(
                        jobCount[0].total_jobs
                    ),

                total_internships:
                    Number(
                        internshipCount[0].total_internships
                    ),

                total_applications:
                    Number(
                        applicationCount[0].total_applications
                    ),

                selected_students:
                    Number(
                        selectedCount[0].selected_students
                    ),

                shortlisted_applications:
                    Number(
                        shortlistedCount[0].shortlisted_applications
                    ),

                interview_applications:
                    Number(
                        interviewCount[0].interview_applications
                    ),

                rejected_applications:
                    Number(
                        rejectedCount[0].rejected_applications
                    ),

                average_skill_score:
                    averageSkill[0].average_skill_score === null
                        ? 0
                        : Number(
                            averageSkill[0].average_skill_score
                        )
            },

            skill_performance:
                skillPerformance,

            application_status:
                applicationStatus
        });


    } catch (error) {

        console.error(
            "Institution Dashboard Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch institution dashboard statistics",

            error:
                error.message
        });
    }
};


// ==========================================
// GET INSTITUTION STUDENTS
// ==========================================

const getStudents = async (req, res) => {
    try {

        const [students] = await db.query(`
            SELECT
                s.id AS student_id,
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
                "Institution students fetched successfully",

            total_students:
                students.length,

            students:
                students
        });


    } catch (error) {

        console.error(
            "Institution Get Students Error:",
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
// GET APPLICATION STATISTICS
// ==========================================

const getApplicationStats = async (req, res) => {
    try {

        const [stats] = await db.query(
            `SELECT
                status,
                COUNT(*) AS total
             FROM applications
             GROUP BY status
             ORDER BY total DESC`
        );


        res.json({

            message:
                "Application statistics fetched successfully",

            statistics:
                stats
        });


    } catch (error) {

        console.error(
            "Application Statistics Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch application statistics",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getDashboardStats,

    getStudents,

    getApplicationStats
};