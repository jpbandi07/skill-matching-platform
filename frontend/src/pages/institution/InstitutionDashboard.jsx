import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


function InstitutionDashboard() {

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


        setUser(
            JSON.parse(storedUser)
        );

    }, [navigate]);


    if (!user) {

        return null;
    }


    return (

        <DashboardLayout

            role="institution"

            user={user}

            title="Institution Dashboard"

            subtitle="A unified view of student skills, opportunities and outcomes."
        >


            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        INSTITUTION WORKSPACE
                    </div>

                    <h2>
                        Your institution, connected by skills.
                    </h2>

                    <p>
                        Monitor student development, opportunities,
                        applications and career outcomes.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/institution/analytics"
                        )
                    }
                >
                    View Analytics
                </button>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        TOTAL STUDENTS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Registered students
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        VERIFIED SKILLS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Assessment results
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        OPPORTUNITIES
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Jobs and internships
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        APPLICATIONS
                    </div>

                    <div className="stat-value">
                        —
                    </div>

                    <div className="stat-change">
                        Student applications
                    </div>

                </div>

            </div>


            <div className="dashboard-two-column">


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Institution Overview
                            </div>

                            <div className="card-description">
                                Key areas to monitor
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="overview-list">

                            <div className="overview-item">

                                <div className="overview-icon">
                                    ♙
                                </div>

                                <div>

                                    <strong>
                                        Student Development
                                    </strong>

                                    <span>
                                        Track student skill profiles
                                    </span>

                                </div>

                                <b>
                                    →
                                </b>

                            </div>


                            <div className="overview-item">

                                <div className="overview-icon">
                                    ◎
                                </div>

                                <div>

                                    <strong>
                                        Skill Landscape
                                    </strong>

                                    <span>
                                        Understand institutional strengths
                                    </span>

                                </div>

                                <b>
                                    →
                                </b>

                            </div>


                            <div className="overview-item">

                                <div className="overview-icon">
                                    ◇
                                </div>

                                <div>

                                    <strong>
                                        Career Opportunities
                                    </strong>

                                    <span>
                                        Monitor jobs and internships
                                    </span>

                                </div>

                                <b>
                                    →
                                </b>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Institutional Analytics
                            </div>

                            <div className="card-description">
                                Performance overview
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="analytics-placeholder">

                            <div className="analytics-placeholder-icon">
                                ▦
                            </div>

                            <strong>
                                Analytics workspace
                            </strong>

                            <span>
                                Your institutional skill and placement
                                metrics will appear here.
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Quick Access
                        </div>

                        <div className="card-description">
                            Manage your institution
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    <div className="quick-actions">

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/dashboard/institution/students"
                                )
                            }
                        >

                            <span>
                                ♙
                            </span>

                            <div>

                                <strong>
                                    Students
                                </strong>

                                <small>
                                    View student information
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
                                    "/dashboard/institution/skills"
                                )
                            }
                        >

                            <span>
                                ◎
                            </span>

                            <div>

                                <strong>
                                    Skills
                                </strong>

                                <small>
                                    Review institutional skills
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
                                    "/dashboard/institution/applications"
                                )
                            }
                        >

                            <span>
                                ▥
                            </span>

                            <div>

                                <strong>
                                    Applications
                                </strong>

                                <small>
                                    Monitor application activity
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
                                    "/dashboard/institution/analytics"
                                )
                            }
                        >

                            <span>
                                ▦
                            </span>

                            <div>

                                <strong>
                                    Analytics
                                </strong>

                                <small>
                                    Explore institutional insights
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


export default InstitutionDashboard;