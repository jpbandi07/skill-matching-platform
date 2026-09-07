import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function IndustryApplicants() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [updating, setUpdating] =
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


        const loadApplications =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/jobs/industry/applications`,
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

                        setApplications(
                            data.applications || []
                        );
                    }

                } catch (error) {

                    console.error(
                        "Applicants Error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadApplications();

    }, [navigate]);


    const updateStatus =
        async (
            applicationId,
            status
        ) => {

            const token =
                localStorage.getItem(
                    "skillbridge_token"
                );


            setUpdating(
                applicationId
            );


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/jobs/applications/${applicationId}/status`,
                        {

                            method: "PUT",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({
                                    status
                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update status"
                    );
                }


                setApplications(
                    previous =>
                        previous.map(
                            application =>
                                application.application_id ===
                                applicationId

                                    ? {
                                        ...application,
                                        status
                                    }

                                    : application
                        )
                );


            } catch (error) {

                console.error(
                    "Status Update Error:",
                    error
                );

            } finally {

                setUpdating(null);
            }
        };


    if (!user) {

        return null;
    }


    const applied =
        applications.filter(
            item =>
                item.status === "applied"
        ).length;


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

            title="Applicants"

            subtitle="Review candidates and manage your hiring pipeline."
        >


            <div className="dashboard-welcome">

                <div>

                    <div className="welcome-eyebrow">
                        TALENT PIPELINE
                    </div>

                    <h2>
                        Find your next great candidate.
                    </h2>

                    <p>
                        Review student applications and move candidates
                        through your hiring process.
                    </p>

                </div>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        APPLIED
                    </div>

                    <div className="stat-value">
                        {applied}
                    </div>

                    <div className="stat-change">
                        New applications
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
                        Shortlisted candidates
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        INTERVIEW
                    </div>

                    <div className="stat-value">
                        {interviews}
                    </div>

                    <div className="stat-change">
                        Candidates in interview
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


            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Candidate Applications
                        </div>

                        <div className="card-description">
                            Review candidate information and update status
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    {loading ? (

                        <div className="empty-state">
                            Loading applicants...
                        </div>

                    ) : applications.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ◎
                            </div>

                            <strong>
                                No applications yet
                            </strong>

                            <span>
                                Students who apply to your opportunities
                                will appear here.
                            </span>

                        </div>

                    ) : (

                        <div className="industry-applications-list">

                            {applications.map(
                                application => (

                                    <div
                                        className="industry-application-row"
                                        key={
                                            application.application_id
                                        }
                                    >

                                        <div className="industry-candidate-avatar">

                                            {
                                                application.student_name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }

                                        </div>


                                        <div className="industry-candidate-info">

                                            <strong>
                                                {
                                                    application.student_name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    application.student_email
                                                }
                                            </span>

                                            <small>

                                                {
                                                    application.university ||
                                                    "University not provided"
                                                }

                                                {" • "}

                                                {
                                                    application.course ||
                                                    "Course not provided"
                                                }

                                            </small>

                                        </div>


                                        <div className="industry-applied-role">

                                            <span>
                                                APPLIED FOR
                                            </span>

                                            <strong>
                                                {
                                                    application.title
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    application.type
                                                }
                                            </small>

                                        </div>


                                        <div className="industry-status-control">

                                            <span
                                                className={
                                                    `status-pill ${
                                                        application.status
                                                    }`
                                                }
                                            >
                                                {
                                                    application.status
                                                }
                                            </span>


                                            <select
                                                value={
                                                    application.status
                                                }
                                                disabled={
                                                    updating ===
                                                    application.application_id
                                                }
                                                onChange={
                                                    event =>
                                                        updateStatus(
                                                            application.application_id,
                                                            event.target.value
                                                        )
                                                }
                                            >

                                                <option value="applied">
                                                    Applied
                                                </option>

                                                <option value="shortlisted">
                                                    Shortlisted
                                                </option>

                                                <option value="interview">
                                                    Interview
                                                </option>

                                                <option value="selected">
                                                    Selected
                                                </option>

                                                <option value="rejected">
                                                    Rejected
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


        </DashboardLayout>
    );
}


export default IndustryApplicants;