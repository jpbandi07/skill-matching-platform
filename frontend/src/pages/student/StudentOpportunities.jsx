import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function StudentOpportunities() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [jobs, setJobs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [applying, setApplying] =
        useState(null);

    const [message, setMessage] =
        useState("");


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
                            `${API_URL}/api/matching/recommended`,
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
                            data.recommendations || []
                        );

                    } else {

                        setMessage(
                            data.message ||
                            "Unable to load recommendations."
                        );
                    }

                } catch (error) {

                    setMessage(
                        "Unable to connect to the backend."
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadJobs();

    }, [navigate]);


    const applyForJob =
        async jobId => {

            const token =
                localStorage.getItem(
                    "skillbridge_token"
                );


            setApplying(jobId);

            setMessage("");


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/jobs/${jobId}/apply`,
                        {

                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Application failed"
                    );
                }


                setMessage(
                    "Application submitted successfully."
                );


            } catch (error) {

                setMessage(
                    error.message
                );

            } finally {

                setApplying(null);
            }
        };


    if (!user) {

        return null;
    }


    return (

        <DashboardLayout

            role="student"

            user={user}

            title="Opportunities"

            subtitle="Discover jobs and internships matched to your verified skills."
        >


            <div className="opportunities-heading">

                <div>

                    <div className="welcome-eyebrow">
                        SKILL MATCHING
                    </div>

                    <h2>
                        Opportunities built around your skills.
                    </h2>

                    <p>
                        Higher match scores mean your current skill
                        profile is closer to what the opportunity requires.
                    </p>

                </div>


                <div className="opportunity-count">

                    <strong>
                        {jobs.length}
                    </strong>

                    <span>
                        Matches
                    </span>

                </div>

            </div>


            {message && (

                <div className="assessment-error">

                    {message}

                </div>

            )}


            {loading ? (

                <div className="dashboard-card">

                    <div className="empty-state">

                        Loading recommended opportunities...

                    </div>

                </div>

            ) : jobs.length === 0 ? (

                <div className="dashboard-card">

                    <div className="empty-state">

                        <div className="empty-icon">
                            ◇
                        </div>

                        <strong>
                            No opportunities available
                        </strong>

                        <span>
                            Complete your assessment and check again when
                            industry opportunities are available.
                        </span>

                    </div>

                </div>

            ) : (

                <div className="opportunities-grid">

                    {jobs.map(
                        job => (

                            <div
                                className="opportunity-card"
                                key={job.job_id}
                            >

                                <div className="opportunity-card-top">

                                    <div className="job-type-icon large">

                                        {job.type ===
                                            "internship"
                                            ? "↗"
                                            : "◆"}

                                    </div>


                                    <div className="match-score-large">

                                        {job.match_score}%

                                        <span>
                                            match
                                        </span>

                                    </div>

                                </div>


                                <div className="opportunity-card-content">

                                    <div className="opportunity-type">

                                        {job.type}

                                    </div>

                                    <h3>
                                        {job.title}
                                    </h3>

                                    <div className="industry-name">

                                        {job.industry_name}

                                    </div>


                                    {job.description && (

                                        <p>

                                            {job.description}

                                        </p>

                                    )}


                                    <div className="job-meta">

                                        {job.location && (

                                            <span>
                                                ◉ {job.location}
                                            </span>

                                        )}

                                        {job.salary && (

                                            <span>
                                                ₹ {job.salary}
                                            </span>

                                        )}

                                        {job.duration && (

                                            <span>
                                                ◷ {job.duration}
                                            </span>

                                        )}

                                    </div>


                                    {job.matched_skills?.length > 0 && (

                                        <div className="job-skills-section">

                                            <div className="job-section-label">
                                                MATCHED SKILLS
                                            </div>

                                            <div className="skill-tags">

                                                {job.matched_skills
                                                    .slice(0, 4)
                                                    .map(
                                                        skill => (

                                                            <span
                                                                className="skill-tag matched"
                                                                key={
                                                                    skill.skill_id
                                                                }
                                                            >
                                                                {skill.skill_name}
                                                            </span>

                                                        )
                                                    )}

                                            </div>

                                        </div>

                                    )}


                                    {job.skill_gaps?.length > 0 && (

                                        <div className="job-skills-section">

                                            <div className="job-section-label">
                                                SKILL GAPS
                                            </div>

                                            <div className="skill-tags">

                                                {job.skill_gaps
                                                    .slice(0, 3)
                                                    .map(
                                                        skill => (

                                                            <span
                                                                className="skill-tag gap"
                                                                key={
                                                                    skill.skill_id
                                                                }
                                                            >
                                                                {skill.skill_name}
                                                            </span>

                                                        )
                                                    )}

                                            </div>

                                        </div>

                                    )}

                                </div>


                                <div className="opportunity-card-footer">

                                    <button
                                        className="primary-button full-width"
                                        onClick={() =>
                                            applyForJob(
                                                job.job_id
                                            )
                                        }
                                        disabled={
                                            applying ===
                                            job.job_id
                                        }
                                    >

                                        {applying ===
                                            job.job_id
                                            ? "Applying..."
                                            : "Apply Now →"}

                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>

            )}

        </DashboardLayout>
    );
}


export default StudentOpportunities;