import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


function StudentAssessment() {

    const navigate = useNavigate();


    const [user, setUser] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [answers, setAnswers] =
        useState({});

    const [result, setResult] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD QUESTIONS
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


        setUser(
            JSON.parse(storedUser)
        );


        const loadQuestions =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/assessment/questions`,
                            {
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
                            "Failed to load assessment"
                        );
                    }


                    setQuestions(
                        data.questions || []
                    );

                } catch (err) {

                    setError(
                        err.message
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadQuestions();

    }, [navigate]);


    // ==========================================
    // SELECT ANSWER
    // ==========================================

    const selectAnswer =
        (questionId, option) => {

            setAnswers(
                previous => ({

                    ...previous,

                    [questionId]:
                        option
                })
            );

            setError("");
        };


    // ==========================================
    // SUBMIT
    // ==========================================

    const submitAssessment =
        async () => {

            if (
                Object.keys(answers).length !==
                questions.length
            ) {

                setError(
                    `Please answer all ${questions.length} questions before submitting.`
                );

                return;
            }


            const token =
                localStorage.getItem(
                    "skillbridge_token"
                );


            setSubmitting(true);

            setError("");


            try {

                const formattedAnswers =
                    Object.entries(
                        answers
                    ).map(
                        ([questionId, option]) => ({

                            question_id:
                                Number(questionId),

                            selected_option:
                                option
                        })
                    );


                const response =
                    await fetch(
                        `${API_URL}/api/assessment/submit`,
                        {

                            method: "POST",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    answers:
                                        formattedAnswers

                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Assessment submission failed"
                    );
                }


                setResult(data);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            } catch (err) {

                setError(
                    err.message
                );

            } finally {

                setSubmitting(false);
            }
        };


    if (!user) {

        return null;
    }


    // ==========================================
    // RESULT SCREEN
    // ==========================================

    if (result) {

        return (

            <DashboardLayout

                role="student"

                user={user}

                title="Assessment Results"

                subtitle="Your verified skill assessment has been completed."
            >

                <div className="assessment-result-hero">

                    <div className="result-circle">

                        <strong>
                            {result.overall_score}%
                        </strong>

                        <span>
                            Overall Score
                        </span>

                    </div>


                    <div className="result-copy">

                        <div className="welcome-eyebrow">
                            ASSESSMENT COMPLETE
                        </div>

                        <h2>
                            Your skill profile is ready.
                        </h2>

                        <p>
                            Your results have been saved and
                            will now be used to recommend relevant
                            opportunities.
                        </p>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Skill Results
                            </div>

                            <div className="card-description">
                                Performance across assessed skills
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="skill-list">

                            {result.skill_results?.map(
                                skill => (

                                    <div
                                        className="skill-row"
                                        key={skill.skill_id}
                                    >

                                        <div className="skill-row-top">

                                            <span className="skill-name">

                                                {skill.skill_name ||
                                                    `Skill ${skill.skill_id}`}

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


                                        <div className="proficiency-label">

                                            Proficiency Level{" "}

                                            <strong>
                                                {skill.proficiency}/5
                                            </strong>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>


                <div className="assessment-result-actions">

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/student/skills"
                            )
                        }
                    >
                        View Skill Profile
                    </button>


                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/student/opportunities"
                            )
                        }
                    >
                        Find Opportunities
                    </button>

                </div>

            </DashboardLayout>
        );
    }


    // ==========================================
    // ASSESSMENT SCREEN
    // ==========================================

    return (

        <DashboardLayout

            role="student"

            user={user}

            title="Skill Assessment"

            subtitle="Evaluate your current skills and build your verified profile."
        >


            <div className="assessment-intro">

                <div>

                    <div className="welcome-eyebrow">
                        PLATFORM ASSESSMENT
                    </div>

                    <h2>
                        Show us what you know.
                    </h2>

                    <p>
                        Answer each question honestly. Your results
                        will be used to understand your strengths and
                        match you with suitable opportunities.
                    </p>

                </div>


                <div className="assessment-counter">

                    <strong>
                        {Object.keys(answers).length}
                    </strong>

                    <span>
                        / {questions.length} answered
                    </span>

                </div>

            </div>


            {error && (

                <div className="assessment-error">

                    {error}

                </div>

            )}


            {loading ? (

                <div className="dashboard-card">

                    <div className="empty-state">

                        Loading assessment questions...

                    </div>

                </div>

            ) : (

                <div className="assessment-question-list">

                    {questions.map(
                        (question, index) => {

                            const selected =
                                answers[
                                    question.id
                                ];


                            return (

                                <div
                                    className="dashboard-card assessment-question"
                                    key={question.id}
                                >

                                    <div className="question-number">

                                        QUESTION{" "}
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}

                                    </div>


                                    <h3>

                                        {question.question}

                                    </h3>


                                    <div className="question-options">

                                        {[
                                            ["A", question.option_a],
                                            ["B", question.option_b],
                                            ["C", question.option_c],
                                            ["D", question.option_d]
                                        ].map(
                                            ([letter, text]) => (

                                                <button
                                                    key={letter}
                                                    className={
                                                        `question-option ${
                                                            selected ===
                                                            letter
                                                                ? "selected"
                                                                : ""
                                                        }`
                                                    }
                                                    onClick={() =>
                                                        selectAnswer(
                                                            question.id,
                                                            letter
                                                        )
                                                    }
                                                >

                                                    <span className="option-letter">

                                                        {letter}

                                                    </span>


                                                    <span className="option-text">

                                                        {text}

                                                    </span>


                                                    <span className="option-check">

                                                        {selected ===
                                                            letter
                                                            ? "✓"
                                                            : ""}

                                                    </span>

                                                </button>

                                            )
                                        )}

                                    </div>


                                    <div className="question-skill">

                                        Skill:

                                        <strong>
                                            {question.skill_name}
                                        </strong>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            )}


            {!loading &&
                questions.length > 0 && (

                    <div className="assessment-submit-area">

                        <div>

                            <strong>
                                Ready to submit?
                            </strong>

                            <span>
                                Make sure you've answered every question.
                            </span>

                        </div>


                        <button
                            className="primary-button assessment-submit-button"
                            onClick={
                                submitAssessment
                            }
                            disabled={
                                submitting
                            }
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Assessment"
                            }

                        </button>

                    </div>

                )}

        </DashboardLayout>
    );
}


export default StudentAssessment;