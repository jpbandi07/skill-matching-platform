import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


function AcademicianDashboard() {

    const navigate = useNavigate();

    const [user, setUser] =
        useState(null);


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

    }, [navigate]);


    if (!user) {

        return null;
    }


    return (

        <DashboardLayout

            role="academician"

            user={user}

            title="Academician Dashboard"

            subtitle="Understand student skills, performance and development gaps."
        >


            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        ACADEMIC WORKSPACE
                    </div>

                    <h2>
                        Student development at a glance.
                    </h2>

                    <p>
                        Monitor skill development and identify areas
                        where students need additional support.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/academician/students"
                        )
                    }
                >
                    View Students
                </button>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        STUDENTS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Student records
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        ASSESSMENTS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Completed assessments
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        AVG SKILL SCORE
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Institution average
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        SKILL GAPS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Areas requiring attention
                    </div>

                </div>

            </div>


            <div className="dashboard-two-column">


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Skill Analytics
                            </div>

                            <div className="card-description">
                                Student skill performance
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="analytics-placeholder">

                            <div className="analytics-placeholder-icon">
                                ◫
                            </div>

                            <strong>
                                Skill analytics workspace
                            </strong>

                            <span>
                                Connect this section to institution-wide
                                student analytics.
                            </span>

                        </div>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Skill Gap Analysis
                            </div>

                            <div className="card-description">
                                Areas where students can improve
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="gap-list">

                            <div className="gap-item">

                                <div className="gap-dot"></div>

                                <div>

                                    <strong>
                                        Technical Skills
                                    </strong>

                                    <span>
                                        Review assessment performance
                                    </span>

                                </div>

                            </div>


                            <div className="gap-item">

                                <div className="gap-dot"></div>

                                <div>

                                    <strong>
                                        Problem Solving
                                    </strong>

                                    <span>
                                        Identify students requiring support
                                    </span>

                                </div>

                            </div>


                            <div className="gap-item">

                                <div className="gap-dot"></div>

                                <div>

                                    <strong>
                                        Soft Skills
                                    </strong>

                                    <span>
                                        Monitor communication and teamwork
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Academic Insights
                        </div>

                        <div className="card-description">
                            Tools for student development
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    <div className="quick-actions">

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/dashboard/academician/students"
                                )
                            }
                        >

                            <span>
                                ♙
                            </span>

                            <div>

                                <strong>
                                    Student Directory
                                </strong>

                                <small>
                                    Explore student profiles
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/dashboard/academician/skills"
                                )
                            }
                        >

                            <span>
                                ◎
                            </span>

                            <div>

                                <strong>
                                    Skill Analytics
                                </strong>

                                <small>
                                    Explore skill performance
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/dashboard/academician/gaps"
                                )
                            }
                        >

                            <span>
                                △
                            </span>

                            <div>

                                <strong>
                                    Skill Gaps
                                </strong>

                                <small>
                                    Identify development areas
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>

                    </div>

                </div>

            </div>


        </DashboardLayout>
    );
}


export default AcademicianDashboard;