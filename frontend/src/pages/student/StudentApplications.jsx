import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function StudentApplications() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [applications, setApplications] =
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


        const loadApplications =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/jobs/applications`,
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
                        "Applications Error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadApplications();

    }, [navigate]);


    if (!user) {

        return null;
    }


    return (

        <DashboardLayout

            role="student"

            user={user}

            title="My Applications"

            subtitle="Track every opportunity you've applied for."
        >


            <div className="application-overview">

                <div className="application-overview-stat">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        {applications.length}
                    </strong>

                </div>


                <div className="application-overview-stat">

                    <span>
                        SHORTLISTED
                    </span>

                    <strong>
                        {
                            applications.filter(
                                item =>
                                    item.status ===
                                    "shortlisted"
                            ).length
                        }
                    </strong>

                </div>


                <div className="application-overview-stat">

                    <span>
                        INTERVIEW
                    </span>

                    <strong>
                        {
                            applications.filter(
                                item =>
                                    item.status ===
                                    "interview"
                            ).length
                        }
                    </strong>

                </div>


                <div className="application-overview-stat">

                    <span>
                        SELECTED
                    </span>

                    <strong>
                        {
                            applications.filter(
                                item =>
                                    item.status ===
                                    "selected"
                            ).length
                        }
                    </strong>

                </div>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <div>

                        <div className="card-title">
                            Application History
                        </div>

                        <div className="card-description">
                            Your latest application activity
                        </div>

                    </div>

                </div>


                <div className="card-body">

                    {loading ? (

                        <div className="empty-state">
                            Loading applications...
                        </div>

                    ) : applications.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ▥
                            </div>

                            <strong>
                                No applications yet
                            </strong>

                            <span>
                                Explore opportunities and apply for roles
                                that match your skills.
                            </span>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/dashboard/student/opportunities"
                                    )
                                }
                            >
                                Browse Opportunities
                            </button>

                        </div>

                    ) : (

                        <div className="application-table">

                            <div className="application-table-header">

                                <span>
                                    OPPORTUNITY
                                </span>

                                <span>
                                    TYPE
                                </span>

                                <span>
                                    APPLIED
                                </span>

                                <span>
                                    STATUS
                                </span>

                            </div>


                            {applications.map(
                                application => (

                                    <div
                                        className="application-table-row"
                                        key={
                                            application.application_id
                                        }
                                    >

                                        <div className="application-job">

                                            <div className="application-job-icon">
                                                {application.type ===
                                                    "internship"
                                                    ? "↗"
                                                    : "◆"}
                                            </div>

                                            <div>

                                                <strong>
                                                    {application.title}
                                                </strong>

                                                <span>
                                                    {
                                                        application.industry_name
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="application-type">

                                            {application.type}

                                        </div>


                                        <div className="application-date">

                                            {application.applied_at
                                                ? new Date(
                                                    application.applied_at
                                                ).toLocaleDateString()
                                                : "—"}

                                        </div>


                                        <div>

                                            <span
                                                className={
                                                    `status-pill ${
                                                        application.status
                                                    }`
                                                }
                                            >

                                                {application.status}

                                            </span>

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


export default StudentApplications;