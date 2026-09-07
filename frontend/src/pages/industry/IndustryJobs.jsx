import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function IndustryJobs() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [jobs, setJobs] =
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


        const loadJobs =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/jobs/my-jobs`,
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

                        setJobs(
                            data.jobs || []
                        );
                    }

                } catch (error) {

                    console.error(
                        "Jobs Error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadJobs();

    }, [navigate]);


    if (!user) {

        return null;
    }


    return (

        <DashboardLayout

            role="industry"

            user={user}

            title="My Opportunities"

            subtitle="Manage the jobs and internships posted by your organisation."
        >


            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        OPPORTUNITY MANAGEMENT
                    </div>

                    <h2>
                        Your active opportunities.
                    </h2>

                    <p>
                        Review the opportunities you've published
                        and monitor your hiring activity.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/industry/post"
                        )
                    }
                >
                    + Post Opportunity
                </button>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        TOTAL
                    </div>

                    <div className="stat-value">
                        {jobs.length}
                    </div>

                    <div className="stat-change">
                        Opportunities
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        JOBS
                    </div>

                    <div className="stat-value">

                        {
                            jobs.filter(
                                job =>
                                    job.type ===
                                    "job"
                            ).length
                        }

                    </div>

                    <div className="stat-change">
                        Full-time roles
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        INTERNSHIPS
                    </div>

                    <div className="stat-value">

                        {
                            jobs.filter(
                                job =>
                                    job.type ===
                                    "internship"
                            ).length
                        }

                    </div>

                    <div className="stat-change">
                        Internship roles
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        LATEST
                    </div>

                    <div className="stat-value">
                        {jobs.length > 0 ? "1" : "0"}
                    </div>

                    <div className="stat-change">
                        Recent posting
                    </div>

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Published Opportunities
                        </div>

                        <div className="card-description">
                            All opportunities posted by your organisation
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    {loading ? (

                        <div className="empty-state">
                            Loading opportunities...
                        </div>

                    ) : jobs.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ◇
                            </div>

                            <strong>
                                No opportunities posted
                            </strong>

                            <span>
                                Create a job or internship to start
                                receiving applications.
                            </span>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/dashboard/industry/post"
                                    )
                                }
                            >
                                Post Opportunity
                            </button>

                        </div>

                    ) : (

                        <div className="industry-job-cards">

                            {jobs.map(job => (

                                <div
                                    className="industry-opportunity-card"
                                    key={job.id}
                                >

                                    <div className="industry-opportunity-top">

                                        <div className="opportunity-icon">

                                            {job.type ===
                                                "internship"
                                                ? "↗"
                                                : "◆"}

                                        </div>


                                        <span className="job-type-pill">

                                            {job.type}

                                        </span>

                                    </div>


                                    <h3>
                                        {job.title}
                                    </h3>


                                    <p>

                                        {job.description ||
                                            "No description provided."}

                                    </p>


                                    <div className="job-meta">

                                        <span>
                                            ◉{" "}
                                            {job.location ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            ₹{" "}
                                            {job.salary ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            ◷{" "}
                                            {job.duration ||
                                                "Not specified"}
                                        </span>

                                    </div>


                                    <div className="industry-opportunity-footer">

                                        <span>

                                            Posted{" "}

                                            {job.created_at
                                                ? new Date(
                                                    job.created_at
                                                ).toLocaleDateString()
                                                : "—"}

                                        </span>


                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                navigate(
                                                    "/dashboard/industry/applicants"
                                                )
                                            }
                                        >
                                            View Applicants →
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>


        </DashboardLayout>
    );
}


export default IndustryJobs;