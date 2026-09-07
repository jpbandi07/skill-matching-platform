import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function StudentSkillProfile() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [results, setResults] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


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


        setUser(
            JSON.parse(storedUser)
        );


        const loadResults =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/assessment/results`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                    const data =
                        await response.json();


                    if (response.ok) {

                        setResults(
                            data.results || []
                        );
                    }

                } catch (error) {

                    console.error(
                        "Skill Profile Error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadResults();

    }, [navigate]);


    if (!user) {

        return null;
    }


    const overallScore =
        results.length > 0

            ? Math.round(
                results.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.score),
                    0
                ) / results.length
            )

            : 0;


    const strongSkills =
        results.filter(
            skill =>
                Number(skill.score) >= 80
        );


    const developingSkills =
        results.filter(
            skill =>
                Number(skill.score) >= 40 &&
                Number(skill.score) < 80
        );


    return (

        <DashboardLayout

            role="student"

            user={user}

            title="Skill Profile"

            subtitle="Your verified skills and assessment performance."
        >


            {/* ======================================
                PROFILE SUMMARY
            ====================================== */}

            <div className="profile-summary">

                <div className="profile-score">

                    <div className="profile-score-number">
                        {overallScore}%
                    </div>

                    <div className="profile-score-label">
                        Overall Skill Score
                    </div>

                </div>


                <div className="profile-summary-divider"></div>


                <div className="profile-summary-stat">

                    <strong>
                        {results.length}
                    </strong>

                    <span>
                        Assessed skills
                    </span>

                </div>


                <div className="profile-summary-stat">

                    <strong>
                        {strongSkills.length}
                    </strong>

                    <span>
                        Strong skills
                    </span>

                </div>


                <div className="profile-summary-stat">

                    <strong>
                        {developingSkills.length}
                    </strong>

                    <span>
                        Developing
                    </span>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/student/assessment"
                        )
                    }
                >
                    Retake Assessment
                </button>

            </div>


            {/* ======================================
                SKILLS
            ====================================== */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Verified Skills
                        </div>

                        <div className="card-description">
                            Skills measured through the platform assessment
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    {loading ? (

                        <div className="empty-state">
                            Loading your skills...
                        </div>

                    ) : results.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ◎
                            </div>

                            <strong>
                                Your skill profile is empty
                            </strong>

                            <span>
                                Complete the assessment to build your verified profile.
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

                    ) : (

                        <div className="full-skill-grid">

                            {results.map(
                                skill => {

                                    const score =
                                        Number(
                                            skill.score
                                        );


                                    return (

                                        <div
                                            className="profile-skill-card"
                                            key={
                                                skill.skill_id
                                            }
                                        >

                                            <div className="profile-skill-top">

                                                <div className="profile-skill-icon">
                                                    ◎
                                                </div>


                                                <div>

                                                    <strong>
                                                        {skill.skill_name}
                                                    </strong>

                                                    <span>
                                                        {skill.category ||
                                                            "General Skill"}
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="profile-skill-score">

                                                {score}%

                                            </div>


                                            <div className="progress-track">

                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width:
                                                            `${score}%`
                                                    }}
                                                ></div>

                                            </div>


                                            <div className="proficiency-row">

                                                <span>
                                                    Proficiency
                                                </span>

                                                <strong>

                                                    {score >= 80
                                                        ? "Advanced"
                                                        : score >= 60
                                                            ? "Strong"
                                                            : score >= 40
                                                                ? "Developing"
                                                                : "Beginner"}

                                                </strong>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>

            </div>


        </DashboardLayout>
    );
}


export default StudentSkillProfile;