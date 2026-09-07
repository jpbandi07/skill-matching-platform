const db = require("../config/db");

const getRecommendedCourses = async (req, res) => {
    try {
        const studentUserId = req.user.id;

        // Find student ID
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

        // Get assessment results
        const [results] = await db.query(
            `SELECT
                ar.skill_id,
                ar.score,
                s.name AS skill_name
             FROM assessment_results ar
             JOIN skills s
                ON ar.skill_id = s.id
             WHERE ar.student_id = ?
             ORDER BY ar.score ASC`,
            [studentId]
        );

        // Student must complete assessment first
        if (results.length === 0) {
            return res.status(400).json({
                message: "Please complete the skill assessment first."
            });
        }

        // Only recommend courses for skills below 60%
        const weakSkills = results.filter(
            skill => skill.score < 60
        );

        if (weakSkills.length === 0) {
            return res.json({
                message: "No major skill gaps found. Great job!",
                recommendations: []
            });
        }

        // Get courses connected to weak skills
        const skillIds = weakSkills.map(
            skill => skill.skill_id
        );

        const placeholders = skillIds.map(() => "?").join(",");

        const [courses] = await db.query(
            `SELECT
                c.id AS course_id,
                c.title,
                c.description,
                c.provider,
                c.level,
                c.url,
                s.id AS skill_id,
                s.name AS skill_name
             FROM courses c
             JOIN course_skills cs
                ON c.id = cs.course_id
             JOIN skills s
                ON cs.skill_id = s.id
             WHERE s.id IN (${placeholders})
             ORDER BY c.id`,
            skillIds
        );

        // Add score, skill gap and priority
        const recommendations = courses.map(course => {

            const skillResult = weakSkills.find(
                skill => skill.skill_id === course.skill_id
            );

            const score = skillResult.score;

            let priority;

            if (score < 40) {
                priority = "High";
            } else {
                priority = "Medium";
            }

            return {
                course_id: course.course_id,
                title: course.title,
                description: course.description,
                provider: course.provider,
                level: course.level,
                url: course.url,
                skill_id: course.skill_id,
                skill_name: course.skill_name,
                score: score,
                skill_gap: 100 - score,
                priority: priority
            };
        });

        // Weakest skills first
        recommendations.sort(
            (a, b) => a.score - b.score
        );

        res.json({
            message: "Recommended courses fetched successfully",
            recommendations: recommendations
        });

    } catch (error) {
        console.error("Course Recommendation Error:", error);

        res.status(500).json({
            message: "Failed to fetch course recommendations",
            error: error.message
        });
    }
};

module.exports = {
    getRecommendedCourses
};