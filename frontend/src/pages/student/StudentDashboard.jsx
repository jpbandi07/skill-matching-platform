import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function StudentDashboard() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [skillProfile, setSkillProfile] =
        useState(null);

    const [recommendations, setRecommendations] =
        useState([]);

    const [courseRecommendations, setCourseRecommendations] =
        useState([]);

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "skillbridge_user"
            );

        const token =
            localStorage.getItem(
                "skillbridge_token"
            );


        if (!storedUser || !token) {

            navigate("/");

            return;
        }


        const parsedUser =
            JSON.parse(storedUser);


        setUser(parsedUser);


        const headers = {

            Authorization:
                `Bearer ${token}`,

            "Content-Type":
                "application/json"
        };


        const loadData = async () => {

            try {

                const [
                    skillsResponse,
                    jobsResponse,
                    applicationsResponse,
                    coursesResponse
                ] = await Promise.all([

                    fetch(
                        `${API_URL}/api/assessment/results`,
                        {
                            headers
                        }
                    ),

                    fetch(
                        `${API_URL}/api/matching/recommended`,
                        {
                            headers
                        }
                    ),

                    fetch(
                        `${API_URL}/api/jobs/applications`,
                        {
                            headers
                        }
                    ),

                    fetch(
                        `${API_URL}/api/courses/recommended`,
                        {
                            headers
                        }
                    )
                ]);


                // ==========================================
                // SKILL PROFILE
                // ==========================================

                if (skillsResponse.ok) {

                    const data =
                        await skillsResponse.json();

                    const results =
                        data.results || [];


                    const totalSkills =
                        results.length;


                    const strongSkills =
                        results.filter(
                            skill => skill.score >= 80
                        ).length;


                    const overallScore =
                        totalSkills > 0
                            ? Math.round(
                                results.reduce(
                                    (sum, skill) =>
                                        sum + skill.score,
                                    0
                                ) / totalSkills
                            )
                            : 0;


                    setSkillProfile({

                        all_skills:
                            results,

                        total_skills:
                            totalSkills,

                        strong_skills:
                            results.filter(
                                skill => skill.score >= 80
                            ),

                        overall_score:
                            overallScore

                    });
                }


                // ==========================================
                // JOB RECOMMENDATIONS
                // ==========================================

                if (jobsResponse.ok) {

                    const data =
                        await jobsResponse.json();

                    setRecommendations(
                        data.recommendations || []
                    );
                }


                // ==========================================
                // APPLICATIONS
                // ==========================================

                if (applicationsResponse.ok) {

                    const data =
                        await applicationsResponse.json();

                    setApplications(
                        data.applications || []
                    );
                }


                // ==========================================
                // COURSE RECOMMENDATIONS
                // ==========================================

                if (coursesResponse.ok) {

                    const data =
                        await coursesResponse.json();

                    setCourseRecommendations(
                        data.recommendations || []
                    );
                }


            } catch (error) {

                console.error(
                    "Student Dashboard Error:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };


        loadData();

    }, [navigate]);


    if (!user) {

        return null;
    }


    const strongSkills =
        skillProfile?.strong_skills?.length || 0;

    const totalSkills =
        skillProfile?.total_skills || 0;

    const overallScore =
        skillProfile?.overall_score || 0;


    return (

        <DashboardLayout

            role="student"

            user={user}

            title="Student Dashboard"

            subtitle="Your skills, opportunities and career journey in one place."
        >


            {/* ======================================
                WELCOME
            ====================================== */}

            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        YOUR WORKSPACE
                    </div>

                    <h2>
                        Welcome back, {user.name?.split(" ")[0]}.
                    </h2>

                    <p>
                        Keep building your skills and discover
                        opportunities that match your profile.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/student/assessment"
                        )
                    }
                >
                    Take Assessment
                </button>

            </div>


            {/* ======================================
                STATS
            ====================================== */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        OVERALL SKILL SCORE
                    </div>

                    <div className="stat-value">
                        {overallScore}%
                    </div>

                    <div className="stat-change">
                        Based on your assessment
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        VERIFIED SKILLS
                    </div>

                    <div className="stat-value">
                        {totalSkills}
                    </div>

                    <div className="stat-change">
                        Skills assessed
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        STRONG SKILLS
                    </div>

                    <div className="stat-value">
                        {strongSkills}
                    </div>

                    <div className="stat-change">
                        Score ≥ 80%
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        OPPORTUNITIES
                    </div>

                    <div className="stat-value">
                        {recommendations.length}
                    </div>

                    <div className="stat-change">
                        Matched opportunities
                    </div>

                </div>

            </div>


            {/* ======================================
                MAIN GRID
            ====================================== */}

            <div className="dashboard-two-column">


                {/* ======================================
                    SKILLS
                ====================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Your Skill Profile
                            </div>

                            <div className="card-description">
                                Current assessment performance
                            </div>

                        </div>


                        <button
                            className="text-button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/student/skills"
                                )
                            }
                        >
                            View profile →
                        </button>

                    </div>


                    <div className="card-body">

                        {loading ? (

                            <div className="empty-state">
                                Loading skill profile...
                            </div>

                        ) : skillProfile?.all_skills?.length ? (

                            <div className="skill-list">

                                {skillProfile.all_skills
                                    .slice(0, 6)
                                    .map((skill) => (

                                        <div
                                            className="skill-row"
                                            key={skill.skill_id}
                                        >

                                            <div className="skill-row-top">

                                                <span className="skill-name">

                                                    {skill.skill_name}

                                                </span>

                                                <span className="skill-score">

                                                    {skill.score}%

                                                </span>

                                            </div>


                                            <div className="progress-track">

                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width:
                                                            `${skill.score}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        ) : (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ◎
                                </div>

                                <strong>
                                    Complete your assessment
                                </strong>

                                <span>
                                    Your verified skills will appear here.
                                </span>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/dashboard/student/assessment"
                                        )
                                    }
                                >
                                    Start Assessment
                                </button>

                            </div>

                        )}

                    </div>

                </div>


                {/* ======================================
                    OPPORTUNITIES
                ====================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Recommended Opportunities
                            </div>

                            <div className="card-description">
                                Based on your verified skills
                            </div>

                        </div>


                        <button
                            className="text-button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/student/opportunities"
                                )
                            }
                        >
                            View all →
                        </button>

                    </div>


                    <div className="card-body">

                        {loading ? (

                            <div className="empty-state">
                                Loading opportunities...
                            </div>

                        ) : recommendations.length > 0 ? (

                            <div className="opportunity-list">

                                {recommendations
                                    .slice(0, 4)
                                    .map((job) => (

                                        <div
                                            className="opportunity-item"
                                            key={job.job_id}
                                        >

                                            <div className="opportunity-icon">
                                                {job.type === "internship"
                                                    ? "↗"
                                                    : "◆"}
                                            </div>


                                            <div className="opportunity-info">

                                                <strong>
                                                    {job.title}
                                                </strong>

                                                <span>
                                                    {job.industry_name}
                                                </span>

                                            </div>


                                            <div className="match-badge">

                                                {job.match_score}%

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        ) : (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ◇
                                </div>

                                <strong>
                                    No recommendations yet
                                </strong>

                                <span>
                                    Complete your assessment to unlock matching opportunities.
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* ======================================
                RECOMMENDED COURSES
            ====================================== */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Recommended Courses
                        </div>

                        <div className="card-description">
                            Courses selected based on your skill gaps
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    {loading ? (

                        <div className="empty-state">
                            Loading course recommendations...
                        </div>

                    ) : courseRecommendations.length > 0 ? (

                        <div className="opportunity-list">

                            {courseRecommendations
                                .slice(0, 6)
                                .map((course) => (

                                    <div
                                        className="opportunity-item"
                                        key={`${course.course_id}-${course.skill_id}`}
                                    >

                                        <div className="opportunity-icon">
                                            📚
                                        </div>


                                        <div className="opportunity-info">

                                            <strong>
                                                {course.title}
                                            </strong>

                                            <span>
                                                Improve: {course.skill_name}
                                                {" • "}
                                                Current score: {course.score}%
                                                {" • "}
                                                Gap: {course.skill_gap}%
                                            </span>

                                        </div>


                                        <div>

                                            <div
                                                className="match-badge"
                                                style={{
                                                    marginBottom: "8px"
                                                }}
                                            >
                                                {course.priority}
                                            </div>


                                            {course.url && (

                                                <a
                                                    href={course.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-button"
                                                >
                                                    View Course →
                                                </a>

                                            )}

                                        </div>

                                    </div>

                                ))}

                        </div>

                    ) : (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🎯
                            </div>

                            <strong>
                                No course recommendations
                            </strong>

                            <span>
                                Complete your assessment or improve your current skills to receive course recommendations.
                            </span>

                        </div>

                    )}

                </div>

            </div>


            {/* ======================================
                APPLICATIONS
            ====================================== */}

            <div className="dashboard-card application-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Recent Applications
                        </div>

                        <div className="card-description">
                            Track the progress of your applications
                        </div>

                    </div>


                    <button
                        className="text-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/student/applications"
                            )
                        }
                    >
                        View applications →
                    </button>

                </div>


                <div className="card-body">

                    {applications.length > 0 ? (

                        <div className="application-list">

                            {applications
                                .slice(0, 5)
                                .map((application) => (

                                    <div
                                        className="application-row"
                                        key={
                                            application.application_id
                                        }
                                    >

                                        <div>

                                            <strong>
                                                {application.job?.title ||
                                                    application.title ||
                                                    "Opportunity"}
                                            </strong>

                                            <span>
                                                {application.job?.industry_name ||
                                                    application.industry_name ||
                                                    ""}
                                            </span>

                                        </div>


                                        <div className="application-match">

                                            {application.match_score
                                                ? `${application.match_score}% match`
                                                : "Applied"}

                                        </div>


                                        <div
                                            className={`status-pill ${application.status}`}
                                        >
                                            {application.status}
                                        </div>

                                    </div>

                                ))}

                        </div>

                    ) : (

                        <div className="empty-state horizontal">

                            <div>

                                <strong>
                                    No applications yet
                                </strong>

                                <span>
                                    Find a matching opportunity and apply.
                                </span>

                            </div>


                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/dashboard/student/opportunities"
                                    )
                                }
                            >
                                Browse Opportunities
                            </button>

                        </div>

                    )}

                </div>

            </div>


        </DashboardLayout>
    );
}


export default StudentDashboard;