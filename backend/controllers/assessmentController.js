const db = require("../config/db");


// ==========================================
// GET SELF-ASSESSMENT QUESTIONS
// ==========================================

const getQuestions = async (req, res) => {
    try {

        const [questions] = await db.query(`
            SELECT
                aq.id,
                aq.question,
                aq.option_a,
                aq.option_b,
                aq.option_c,
                aq.option_d,
                aq.skill_id,
                s.name AS skill_name
            FROM assessment_questions aq
            JOIN skills s
                ON aq.skill_id = s.id
            ORDER BY aq.id
        `);

        res.json({
            message: "Self-assessment questions fetched successfully",
            total_questions: questions.length,
            questions: questions
        });

    } catch (error) {

        console.error("Get Questions Error:", error);

        res.status(500).json({
            message: "Failed to fetch assessment questions",
            error: error.message
        });
    }
};


// ==========================================
// SUBMIT SELF-ASSESSMENT
// ==========================================

const submitAssessment = async (req, res) => {
    try {

        const studentUserId = req.user.id;

        const { answers } = req.body;


        // ------------------------------------------
        // Validate answers
        // ------------------------------------------

        if (
            !answers ||
            !Array.isArray(answers) ||
            answers.length === 0
        ) {
            return res.status(400).json({
                message: "Answers are required"
            });
        }


        // ------------------------------------------
        // Find student
        // ------------------------------------------

        const [students] = await db.query(
            `SELECT id
             FROM students
             WHERE user_id = ?`,
            [studentUserId]
        );


        if (students.length === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }


        const studentId = students[0].id;


        // ------------------------------------------
        // Get questions and correct answers
        // ------------------------------------------

        const [questions] = await db.query(`
            SELECT
                id,
                skill_id,
                correct_option
            FROM assessment_questions
        `);


        if (questions.length === 0) {
            return res.status(404).json({
                message: "No assessment questions found"
            });
        }


        // ------------------------------------------
        // Remove previous assessment
        // ------------------------------------------

        await db.query(
            `DELETE FROM assessment_answers
             WHERE student_id = ?`,
            [studentId]
        );


        await db.query(
            `DELETE FROM assessment_results
             WHERE student_id = ?`,
            [studentId]
        );


        // ------------------------------------------
        // Calculate results
        // ------------------------------------------

        const skillStats = {};

        let totalCorrect = 0;

        let questionsAnswered = 0;


        for (const answer of answers) {

            const question = questions.find(
                q => q.id === Number(answer.question_id)
            );


            if (!question) {
                continue;
            }


            questionsAnswered++;


            const selectedOption =
                String(
                    answer.selected_option || ""
                ).toUpperCase();


            const correctOption =
                String(
                    question.correct_option
                ).toUpperCase();


            const isCorrect =
                selectedOption === correctOption
                    ? 1
                    : 0;


            if (isCorrect) {
                totalCorrect++;
            }


            // ------------------------------------------
            // Save answer
            // ------------------------------------------

            await db.query(
                `INSERT INTO assessment_answers
                (
                    student_id,
                    question_id,
                    selected_option,
                    is_correct
                )
                VALUES (?, ?, ?, ?)`,
                [
                    studentId,
                    question.id,
                    selectedOption,
                    isCorrect
                ]
            );


            // ------------------------------------------
            // Track skill
            // ------------------------------------------

            const skillId =
                question.skill_id;


            if (!skillStats[skillId]) {

                skillStats[skillId] = {
                    total: 0,
                    correct: 0
                };
            }


            skillStats[skillId].total++;


            if (isCorrect) {
                skillStats[skillId].correct++;
            }
        }


        // ------------------------------------------
        // Save skill results
        // ------------------------------------------

        const skillResults = [];


        for (const skillId in skillStats) {

            const total =
                skillStats[skillId].total;

            const correct =
                skillStats[skillId].correct;


            const score = Math.round(
                (correct / total) * 100
            );


            // Save assessment result

            await db.query(
                `INSERT INTO assessment_results
                (
                    student_id,
                    skill_id,
                    score
                )
                VALUES (?, ?, ?)`,
                [
                    studentId,
                    skillId,
                    score
                ]
            );


            // ------------------------------------------
            // Convert score to proficiency
            // ------------------------------------------

            let proficiency;


            if (score >= 80) {

                proficiency = 5;

            } else if (score >= 60) {

                proficiency = 4;

            } else if (score >= 40) {

                proficiency = 3;

            } else if (score >= 20) {

                proficiency = 2;

            } else {

                proficiency = 1;
            }


            // ------------------------------------------
            // Save student skill
            // ------------------------------------------

            await db.query(
                `INSERT INTO student_skills
                (
                    student_id,
                    skill_id,
                    proficiency
                )
                VALUES (?, ?, ?)

                ON DUPLICATE KEY UPDATE
                    proficiency = VALUES(proficiency)`,
                [
                    studentId,
                    skillId,
                    proficiency
                ]
            );


            skillResults.push({
                skill_id: Number(skillId),
                score: score,
                proficiency: proficiency
            });
        }


        // ------------------------------------------
        // Overall score
        // ------------------------------------------

        const overallScore = Math.round(
            (totalCorrect / questions.length) * 100
        );


        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.json({

            message:
                "Assessment submitted successfully",

            total_questions:
                questions.length,

            questions_answered:
                questionsAnswered,

            correct_answers:
                totalCorrect,

            overall_score:
                overallScore,

            skill_results:
                skillResults
        });


    } catch (error) {

        console.error(
            "Submit Assessment Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to submit assessment",

            error:
                error.message
        });
    }
};


// ==========================================
// GET STUDENT ASSESSMENT RESULTS
// ==========================================

const getResults = async (req, res) => {
    try {

        const studentUserId =
            req.user.id;


        // Find student

        const [students] = await db.query(
            `SELECT id
             FROM students
             WHERE user_id = ?`,
            [studentUserId]
        );


        if (students.length === 0) {

            return res.status(404).json({
                message:
                    "Student profile not found"
            });
        }


        const studentId =
            students[0].id;


        // Get results

        const [results] = await db.query(`
            SELECT
                ar.skill_id,
                s.name AS skill_name,
                s.category,
                ar.score
            FROM assessment_results ar
            JOIN skills s
                ON ar.skill_id = s.id
            WHERE ar.student_id = ?
            ORDER BY ar.score DESC
        `, [studentId]);


        res.json({

            message:
                "Assessment results fetched successfully",

            results:
                results
        });


    } catch (error) {

        console.error(
            "Get Results Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch assessment results",

            error:
                error.message
        });
    }
};


module.exports = {
    getQuestions,
    submitAssessment,
    getResults
};