import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function IndustryDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [jobs, setJobs] = useState([]);

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);


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


        const headers = {
            Authorization:
                `Bearer ${token}`,

            "Content-Type":
                "application/json"
        };


        const loadData = async () => {

            try {

                const [
                    jobsResponse,
                    applicationsResponse
                ] = await Promise.all([

                    fetch(
                        `${API_URL}/api/jobs/my-jobs`,
                        { headers }
                    ),

                    fetch(
                        `${API_URL}/api/jobs/industry/applications`,
                        { headers }
                    )

                ]);


                if (jobsResponse.ok) {

                    const data =
                        await jobsResponse.json();

                    setJobs(
                        data.jobs || []
                    );
                }


                if (applicationsResponse.ok) {

                    const data =
                        await applicationsResponse.json();

                    setApplications(
                        data.applications || []
                    );
                }


            } catch (error) {

                console.error(
                    "Industry Dashboard Error:",
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


    const shortlisted =
        applications.filter(
            item =>
                item.status === "shortlisted"
        ).length;


    const interviews =
        applications.filter(
            item =>
                item.status === "interview"
        ).length;


    const selected =
        applications.filter(
            item =>
                item.status === "selected"
        ).length;


    return (

        <DashboardLayout

            role="industry"

            user={user}

            title="Industry Dashboard"

            subtitle="Manage opportunities, discover talent and track your hiring pipeline."
        >


            {/* ======================================
                WELCOME
            ====================================== */}

            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        INDUSTRY WORKSPACE
                    </div>

                    <h2>
                        Welcome back, {user.name?.split(" ")[0]}.
                    </h2>

                    <p>
                        Post opportunities and connect with
                        students whose verified skills match your requirements.
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


            {/* ======================================
                STATS
            ====================================== */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        OPPORTUNITIES
                    </div>

                    <div className="stat-value">
                        {jobs.length}
                    </div>

                    <div className="stat-change">
                        Jobs & internships
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        APPLICATIONS
                    </div>

                    <div className="stat-value">
                        {applications.length}
                    </div>

                    <div className="stat-change">
                        Total candidates
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        SHORTLISTED
                    </div>

                    <div className="stat-value">
                        {shortlisted}
                    </div>

                    <div className="stat-change">
                        Candidates shortlisted
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        SELECTED
                    </div>

                    <div className="stat-value">
                        {selected}
                    </div>

                    <div className="stat-change">
                        Successful candidates
                    </div>

                </div>

            </div>


            {/* ======================================
                MAIN GRID
            ====================================== */}

            <div className="dashboard-two-column">


                {/* OPPORTUNITIES */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Your Opportunities
                            </div>

                            <div className="card-description">
                                Recently posted jobs and internships
                            </div>

                        </div>


                        <button
                            className="text-button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/industry/jobs"
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

                        ) : jobs.length > 0 ? (

                            <div className="opportunity-list">

                                {jobs
                                    .slice(0, 5)
                                    .map(job => (

                                        <div
                                            className="opportunity-item"
                                            key={job.id}
                                        >

                                            <div className="opportunity-icon">

                                                {job.type ===
                                                    "internship"
                                                    ? "↗"
                                                    : "◆"}

                                            </div>


                                            <div className="opportunity-info">

                                                <strong>
                                                    {job.title}
                                                </strong>

                                                <span>
                                                    {job.location ||
                                                        "Location not specified"}
                                                </span>

                                            </div>


                                            <div className="match-badge">

                                                {job.type}

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
                                    No opportunities yet
                                </strong>

                                <span>
                                    Create your first opportunity
                                    and start receiving applications.
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

                        )}

                    </div>

                </div>


                {/* APPLICANTS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Applicant Pipeline
                            </div>

                            <div className="card-description">
                                Latest candidate applications
                            </div>

                        </div>


                        <button
                            className="text-button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/industry/applicants"
                                )
                            }
                        >
                            View all →
                        </button>

                    </div>


                    <div className="card-body">

                        {applications.length > 0 ? (

                            <div className="application-list">

                                {applications
                                    .slice(0, 5)
                                    .map(application => (

                                        <div
                                            className="application-row"
                                            key={
                                                application.application_id
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        application.student_name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        application.title
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                className={
                                                    `status-pill ${
                                                        application.status
                                                    }`
                                                }
                                            >
                                                {
                                                    application.status
                                                }
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
                                    No applicants yet
                                </strong>

                                <span>
                                    Applications will appear here
                                    when students apply.
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* ======================================
                HIRING OVERVIEW
            ====================================== */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Hiring Overview
                        </div>

                        <div className="card-description">
                            Current status of your candidate pipeline
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    <div className="industry-overview-grid">

                        <div className="industry-overview-item">

                            <span>
                                Applied
                            </span>

                            <strong>
                                {
                                    applications.filter(
                                        item =>
                                            item.status ===
                                            "applied"
                                    ).length
                                }
                            </strong>

                        </div>


                        <div className="industry-overview-item">

                            <span>
                                Shortlisted
                            </span>

                            <strong>
                                {shortlisted}
                            </strong>

                        </div>


                        <div className="industry-overview-item">

                            <span>
                                Interview
                            </span>

                            <strong>
                                {interviews}
                            </strong>

                        </div>


                        <div className="industry-overview-item">

                            <span>
                                Selected
                            </span>

                            <strong>
                                {selected}
                            </strong>

                        </div>


                        <div className="industry-overview-item">

                            <span>
                                Rejected
                            </span>

                            <strong>
                                {
                                    applications.filter(
                                        item =>
                                            item.status ===
                                            "rejected"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


        </DashboardLayout>
    );
}


export default IndustryDashboard;