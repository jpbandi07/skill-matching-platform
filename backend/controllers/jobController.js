const db = require("../config/db");


// ==========================================
// CREATE JOB / INTERNSHIP
// ==========================================

const createJob = async (req, res) => {

    let connection;

    try {

        const industryId = req.user.id;

        const {
            title,
            description,
            type,
            location,
            salary,
            duration,
            required_skills
        } = req.body;


        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Job title is required"
            });
        }


        if (!type) {
            return res.status(400).json({
                message: "Job type is required"
            });
        }


        if (!["job", "internship"].includes(type)) {
            return res.status(400).json({
                message: "Type must be job or internship"
            });
        }


        if (
            !Array.isArray(required_skills) ||
            required_skills.length === 0
        ) {
            return res.status(400).json({
                message:
                    "At least one required skill is needed"
            });
        }


        connection = await db.getConnection();

        await connection.beginTransaction();


        const validatedSkills = [];

        const skillIds = new Set();


        for (const skill of required_skills) {

            const skillId =
                Number(skill.skill_id);

            const proficiency =
                Number(skill.required_proficiency);


            if (!Number.isInteger(skillId)) {

                await connection.rollback();

                return res.status(400).json({
                    message: "Invalid skill_id"
                });
            }


            if (
                !Number.isInteger(proficiency) ||
                proficiency < 1 ||
                proficiency > 5
            ) {

                await connection.rollback();

                return res.status(400).json({
                    message:
                        "required_proficiency must be between 1 and 5"
                });
            }


            if (skillIds.has(skillId)) {

                await connection.rollback();

                return res.status(400).json({
                    message:
                        "Duplicate skill found in required_skills"
                });
            }


            skillIds.add(skillId);


            const [skillRows] =
                await connection.query(
                    `SELECT
                        id,
                        name
                     FROM skills
                     WHERE id = ?`,
                    [skillId]
                );


            if (skillRows.length === 0) {

                await connection.rollback();

                return res.status(400).json({
                    message:
                        `Skill with id ${skillId} does not exist`
                });
            }


            validatedSkills.push({

                skill_id:
                    skillId,

                skill_name:
                    skillRows[0].name,

                required_proficiency:
                    proficiency
            });
        }


        const [jobResult] =
            await connection.query(
                `INSERT INTO jobs
                (
                    industry_id,
                    title,
                    description,
                    type,
                    location,
                    salary,
                    duration
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    industryId,
                    title.trim(),
                    description || null,
                    type,
                    location || null,
                    salary || null,
                    duration || null
                ]
            );


        const jobId =
            jobResult.insertId;


        for (const skill of validatedSkills) {

            await connection.query(
                `INSERT INTO job_required_skills
                (
                    job_id,
                    skill_id,
                    required_proficiency
                )
                VALUES (?, ?, ?)`,
                [
                    jobId,
                    skill.skill_id,
                    skill.required_proficiency
                ]
            );
        }


        await connection.commit();


        res.status(201).json({

            message:
                "Job created successfully",

            job_id:
                jobId,

            required_skills:
                validatedSkills
        });


    } catch (error) {

        if (connection) {

            try {
                await connection.rollback();
            } catch (rollbackError) {

                console.error(
                    "Rollback Error:",
                    rollbackError
                );
            }
        }


        console.error(
            "Create Job Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to create job",

            error:
                error.message
        });


    } finally {

        if (connection) {
            connection.release();
        }
    }
};


// ==========================================
// GET INDUSTRY'S JOBS
// ==========================================

const getMyJobs = async (req, res) => {

    try {

        const industryId =
            req.user.id;


        const [jobs] =
            await db.query(
                `SELECT
                    j.id,
                    j.title,
                    j.description,
                    j.type,
                    j.location,
                    j.salary,
                    j.duration,
                    j.created_at,

                    COUNT(
                        jrs.skill_id
                    ) AS required_skill_count

                 FROM jobs j

                 LEFT JOIN job_required_skills jrs
                    ON j.id = jrs.job_id

                 WHERE j.industry_id = ?

                 GROUP BY
                    j.id,
                    j.title,
                    j.description,
                    j.type,
                    j.location,
                    j.salary,
                    j.duration,
                    j.created_at

                 ORDER BY j.created_at DESC`,
                [industryId]
            );


        res.json({

            message:
                "Jobs fetched successfully",

            jobs:
                jobs
        });


    } catch (error) {

        console.error(
            "Get Jobs Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch jobs",

            error:
                error.message
        });
    }
};


// ==========================================
// GET ALL AVAILABLE JOBS
// ==========================================

const getAllJobs = async (req, res) => {

    try {

        const [jobs] =
            await db.query(`
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


        res.json({

            message:
                "Jobs fetched successfully",

            jobs:
                jobs
        });


    } catch (error) {

        console.error(
            "Get All Jobs Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch jobs",

            error:
                error.message
        });
    }
};


// ==========================================
// GET SINGLE JOB DETAILS
// ==========================================

const getJobById = async (req, res) => {

    try {

        const jobId =
            Number(req.params.jobId);


        const [jobs] =
            await db.query(
                `SELECT
                    j.id,
                    j.title,
                    j.description,
                    j.type,
                    j.location,
                    j.salary,
                    j.duration,
                    j.created_at,
                    u.name AS industry_name,
                    u.email AS industry_email
                 FROM jobs j
                 JOIN users u
                    ON j.industry_id = u.id
                 WHERE j.id = ?`,
                [jobId]
            );


        if (jobs.length === 0) {

            return res.status(404).json({
                message:
                    "Job not found"
            });
        }


        const job =
            jobs[0];


        const [requiredSkills] =
            await db.query(
                `SELECT
                    jrs.skill_id,
                    s.name AS skill_name,
                    s.category,
                    jrs.required_proficiency
                 FROM job_required_skills jrs
                 JOIN skills s
                    ON jrs.skill_id = s.id
                 WHERE jrs.job_id = ?`,
                [jobId]
            );


        res.json({

            message:
                "Job details fetched successfully",

            job: {

                id:
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

                industry_email:
                    job.industry_email,

                required_skills:
                    requiredSkills
            }
        });


    } catch (error) {

        console.error(
            "Get Job Details Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch job details",

            error:
                error.message
        });
    }
};


// ==========================================
// STUDENT APPLY FOR JOB
// ==========================================

const applyForJob = async (req, res) => {

    try {

        const userId =
            req.user.id;

        const jobId =
            Number(req.params.jobId);


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


        const studentId =
            students[0].id;


        const [jobs] =
            await db.query(
                `SELECT id
                 FROM jobs
                 WHERE id = ?`,
                [jobId]
            );


        if (jobs.length === 0) {

            return res.status(404).json({
                message:
                    "Job not found"
            });
        }


        const [existing] =
            await db.query(
                `SELECT id
                 FROM applications
                 WHERE job_id = ?
                 AND student_id = ?`,
                [
                    jobId,
                    studentId
                ]
            );


        if (existing.length > 0) {

            return res.status(400).json({
                message:
                    "You have already applied for this job"
            });
        }


        const [result] =
            await db.query(
                `INSERT INTO applications
                (
                    job_id,
                    student_id
                )
                VALUES (?, ?)`,
                [
                    jobId,
                    studentId
                ]
            );


        res.status(201).json({

            message:
                "Application submitted successfully",

            application_id:
                result.insertId
        });


    } catch (error) {

        console.error(
            "Apply Job Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to apply for job",

            error:
                error.message
        });
    }
};


// ==========================================
// STUDENT VIEW APPLICATIONS
// ==========================================

const getMyApplications = async (req, res) => {

    try {

        const userId =
            req.user.id;


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


        const studentId =
            students[0].id;


        const [applications] =
            await db.query(
                `SELECT
                    a.id AS application_id,
                    a.status,
                    a.applied_at,

                    j.id AS job_id,
                    j.title,
                    j.description,
                    j.type,
                    j.location,
                    j.salary,
                    j.duration,

                    u.name AS industry_name

                 FROM applications a

                 JOIN jobs j
                    ON a.job_id = j.id

                 JOIN users u
                    ON j.industry_id = u.id

                 WHERE a.student_id = ?

                 ORDER BY a.applied_at DESC`,
                [studentId]
            );


        const applicationsWithMatch =
            [];


        // ------------------------------------------
        // CALCULATE MATCH INFORMATION
        // ------------------------------------------

        for (const application of applications) {

            const [studentSkills] =
                await db.query(
                    `SELECT
                        ar.skill_id,
                        ar.score
                     FROM assessment_results ar
                     WHERE ar.student_id = ?`,
                    [studentId]
                );


            const studentSkillMap = {};


            for (const skill of studentSkills) {

                studentSkillMap[
                    skill.skill_id
                ] = Number(skill.score);
            }


            const [requiredSkills] =
                await db.query(
                    `SELECT
                        jrs.skill_id,
                        jrs.required_proficiency,
                        s.name AS skill_name
                     FROM job_required_skills jrs
                     JOIN skills s
                        ON jrs.skill_id = s.id
                     WHERE jrs.job_id = ?`,
                    [application.job_id]
                );


            let totalMatch = 0;

            const matchedSkills = [];

            const skillGaps = [];


            for (const requiredSkill of requiredSkills) {

                const studentScore =
                    studentSkillMap[
                        requiredSkill.skill_id
                    ] || 0;


                const requiredScore =
                    Number(
                        requiredSkill.required_proficiency
                    ) * 20;


                let skillMatch = 0;


                if (studentScore >= requiredScore) {

                    skillMatch = 100;

                } else if (requiredScore > 0) {

                    skillMatch =
                        (
                            studentScore /
                            requiredScore
                        ) * 100;
                }


                skillMatch =
                    Math.round(
                        Math.min(
                            skillMatch,
                            100
                        )
                    );


                totalMatch +=
                    skillMatch;


                if (studentScore >= requiredScore) {

                    matchedSkills.push({

                        skill_id:
                            requiredSkill.skill_id,

                        skill_name:
                            requiredSkill.skill_name,

                        student_score:
                            studentScore,

                        required_score:
                            requiredScore
                    });

                } else {

                    skillGaps.push({

                        skill_id:
                            requiredSkill.skill_id,

                        skill_name:
                            requiredSkill.skill_name,

                        student_score:
                            studentScore,

                        required_score:
                            requiredScore,

                        gap:
                            requiredScore -
                            studentScore
                    });
                }
            }


            const matchScore =
                requiredSkills.length > 0
                    ? Math.round(
                        totalMatch /
                        requiredSkills.length
                    )
                    : 0;


            applicationsWithMatch.push({

                application_id:
                    application.application_id,

                status:
                    application.status,

                applied_at:
                    application.applied_at,

                job: {

                    job_id:
                        application.job_id,

                    title:
                        application.title,

                    description:
                        application.description,

                    type:
                        application.type,

                    location:
                        application.location,

                    salary:
                        application.salary,

                    duration:
                        application.duration,

                    industry_name:
                        application.industry_name
                },

                match_score:
                    matchScore,

                matched_skills:
                    matchedSkills,

                skill_gaps:
                    skillGaps
            });
        }


        res.json({

            message:
                "Applications fetched successfully",

            applications:
                applicationsWithMatch
        });


    } catch (error) {

        console.error(
            "Get Applications Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch applications",

            error:
                error.message
        });
    }
};


// ==========================================
// INDUSTRY VIEW APPLICATIONS
// ==========================================

const getIndustryApplications = async (req, res) => {

    try {

        const industryId =
            req.user.id;


        const [applications] =
            await db.query(
                `SELECT
                    a.id AS application_id,
                    a.status,
                    a.applied_at,

                    j.id AS job_id,
                    j.title,
                    j.type,

                    s.id AS student_id,

                    u.name AS student_name,
                    u.email AS student_email,

                    s.university,
                    s.course,
                    s.year

                 FROM applications a

                 JOIN jobs j
                    ON a.job_id = j.id

                 JOIN students s
                    ON a.student_id = s.id

                 JOIN users u
                    ON s.user_id = u.id

                 WHERE j.industry_id = ?

                 ORDER BY a.applied_at DESC`,
                [industryId]
            );


        res.json({

            message:
                "Applications fetched successfully",

            applications:
                applications
        });


    } catch (error) {

        console.error(
            "Get Industry Applications Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch applications",

            error:
                error.message
        });
    }
};


// ==========================================
// INDUSTRY UPDATE APPLICATION STATUS
// ==========================================

const updateApplicationStatus = async (req, res) => {

    try {

        const industryId =
            req.user.id;

        const applicationId =
            Number(
                req.params.applicationId
            );

        const { status } =
            req.body;


        const validStatuses = [
            "applied",
            "shortlisted",
            "interview",
            "selected",
            "rejected"
        ];


        if (!validStatuses.includes(status)) {

            return res.status(400).json({

                message:
                    "Invalid application status"
            });
        }


        const [applications] =
            await db.query(
                `SELECT
                    a.id
                 FROM applications a

                 JOIN jobs j
                    ON a.job_id = j.id

                 WHERE a.id = ?
                 AND j.industry_id = ?`,
                [
                    applicationId,
                    industryId
                ]
            );


        if (applications.length === 0) {

            return res.status(404).json({

                message:
                    "Application not found"
            });
        }


        await db.query(
            `UPDATE applications
             SET status = ?
             WHERE id = ?`,
            [
                status,
                applicationId
            ]
        );


        res.json({

            message:
                "Application status updated successfully",

            application_id:
                applicationId,

            status:
                status
        });


    } catch (error) {

        console.error(
            "Update Application Status Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update application status",

            error:
                error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createJob,
    getMyJobs,
    getAllJobs,
    getJobById,
    applyForJob,
    getMyApplications,
    getIndustryApplications,
    updateApplicationStatus
};