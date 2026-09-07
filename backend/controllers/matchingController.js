const db = require("../config/db");


// ==========================================
// GET RECOMMENDED JOBS
// ==========================================

const getRecommendedJobs = async (req, res) => {
    try {

        const userId = req.user.id;


        // ------------------------------------------
        // FIND STUDENT
        // ------------------------------------------

        const [students] = await db.query(
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


        const studentId =
            students[0].id;


        // ------------------------------------------
        // GET STUDENT ASSESSMENT RESULTS
        // ------------------------------------------

        const [studentSkills] =
            await db.query(
                `SELECT
                    ar.skill_id,
                    ar.score,
                    s.name AS skill_name,
                    s.category
                 FROM assessment_results ar
                 JOIN skills s
                    ON ar.skill_id = s.id
                 WHERE ar.student_id = ?`,
                [studentId]
            );


        if (studentSkills.length === 0) {

            return res.status(400).json({

                message:
                    "Please complete the self-assessment first"
            });
        }


        // ------------------------------------------
        // CREATE STUDENT SKILL MAP
        // ------------------------------------------

        const studentSkillMap = {};


        for (const skill of studentSkills) {

            studentSkillMap[skill.skill_id] = {

                score:
                    Number(skill.score),

                skill_name:
                    skill.skill_name,

                category:
                    skill.category
            };
        }


        // ------------------------------------------
        // GET ALL JOBS
        // ------------------------------------------

        const [jobs] = await db.query(`
            SELECT
                j.id,
                j.title,
                j.description,
                j.type,
                j.location,
                j.salary,
                j.duration,
                j.created_at,
                u.name AS industry_name
            FROM jobs j
            JOIN users u
                ON j.industry_id = u.id
            ORDER BY j.created_at DESC
        `);


        const recommendations = [];


        // ------------------------------------------
        // PROCESS EVERY JOB
        // ------------------------------------------

        for (const job of jobs) {


            // ------------------------------------------
            // GET REQUIRED SKILLS
            // ------------------------------------------

            const [requiredSkills] =
                await db.query(
                    `SELECT
                        jrs.skill_id,
                        jrs.required_proficiency,
                        s.name AS skill_name,
                        s.category
                     FROM job_required_skills jrs
                     JOIN skills s
                        ON jrs.skill_id = s.id
                     WHERE jrs.job_id = ?`,
                    [job.id]
                );


            // Ignore jobs without required skills

            if (requiredSkills.length === 0) {
                continue;
            }


            let totalMatchScore = 0;


            const matchedSkills = [];

            const skillGaps = [];


            // ------------------------------------------
            // COMPARE EVERY REQUIRED SKILL
            // ------------------------------------------

            for (const requiredSkill of requiredSkills) {

                const studentSkill =
                    studentSkillMap[
                        requiredSkill.skill_id
                    ];


                const studentScore =
                    studentSkill
                        ? studentSkill.score
                        : 0;


                const requiredProficiency =
                    Number(
                        requiredSkill.required_proficiency
                    );


                // Convert proficiency 1-5
                // into percentage requirement

                const requiredScore =
                    requiredProficiency * 20;


                // --------------------------------------
                // CALCULATE SKILL MATCH
                // --------------------------------------

                let skillMatchScore;


                if (studentScore >= requiredScore) {

                    skillMatchScore = 100;

                } else {

                    skillMatchScore =
                        (
                            studentScore /
                            requiredScore
                        ) * 100;
                }


                skillMatchScore =
                    Math.round(
                        Math.min(
                            skillMatchScore,
                            100
                        )
                    );


                totalMatchScore +=
                    skillMatchScore;


                // --------------------------------------
                // MATCHED SKILL
                // --------------------------------------

                if (
                    studentScore >= requiredScore
                ) {

                    matchedSkills.push({

                        skill_id:
                            requiredSkill.skill_id,

                        skill_name:
                            requiredSkill.skill_name,

                        category:
                            requiredSkill.category,

                        student_score:
                            studentScore,

                        required_proficiency:
                            requiredProficiency,

                        required_score:
                            requiredScore,

                        match_score:
                            skillMatchScore
                    });


                } else {

                    // ----------------------------------
                    // SKILL GAP
                    // ----------------------------------

                    skillGaps.push({

                        skill_id:
                            requiredSkill.skill_id,

                        skill_name:
                            requiredSkill.skill_name,

                        category:
                            requiredSkill.category,

                        student_score:
                            studentScore,

                        required_proficiency:
                            requiredProficiency,

                        required_score:
                            requiredScore,

                        gap:
                            requiredScore -
                            studentScore,

                        match_score:
                            skillMatchScore
                    });
                }
            }


            // ------------------------------------------
            // OVERALL MATCH SCORE
            // ------------------------------------------

            const matchScore =
                Math.round(
                    totalMatchScore /
                    requiredSkills.length
                );


            // ------------------------------------------
            // RECOMMENDATION LEVEL
            // ------------------------------------------

            let recommendation;


            if (matchScore >= 80) {

                recommendation =
                    "Highly Recommended";

            } else if (matchScore >= 60) {

                recommendation =
                    "Recommended";

            } else if (matchScore >= 40) {

                recommendation =
                    "Possible Match";

            } else {

                recommendation =
                    "Low Match";
            }


            // ------------------------------------------
            // ADD RECOMMENDATION
            // ------------------------------------------

            recommendations.push({

                job_id:
                    job.id,

                title:
                    job.title,

                description:
                    job.description,

                type:
                    job.type,

                location:
                    job.location,

                salary:
                    job.salary,

                duration:
                    job.duration,

                created_at:
                    job.created_at,

                industry_name:
                    job.industry_name,

                match_score:
                    matchScore,

                recommendation:
                    recommendation,

                total_required_skills:
                    requiredSkills.length,

                matched_skill_count:
                    matchedSkills.length,

                skill_gap_count:
                    skillGaps.length,

                matched_skills:
                    matchedSkills,

                skill_gaps:
                    skillGaps
            });
        }


        // ------------------------------------------
        // SORT BY MATCH SCORE
        // ------------------------------------------

        recommendations.sort(
            (a, b) =>
                b.match_score -
                a.match_score
        );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.json({

            message:
                "Job recommendations generated successfully",

            total_jobs_considered:
                recommendations.length,

            recommendations:
                recommendations
        });


    } catch (error) {

        console.error(
            "Recommended Jobs Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to generate job recommendations",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getRecommendedJobs
};