import { useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useParams
} from "react-router-dom";


import StudentDashboard
    from "./pages/student/StudentDashboard";

import StudentAssessment
    from "./pages/student/StudentAssessment";

import StudentSkillProfile
    from "./pages/student/StudentSkillProfile";

import StudentOpportunities
    from "./pages/student/StudentOpportunities";

import StudentApplications
    from "./pages/student/StudentApplications";


import IndustryDashboard
    from "./pages/industry/IndustryDashboard";

import IndustryPostJob
    from "./pages/industry/IndustryPostJob";

import IndustryJobs
    from "./pages/industry/IndustryJobs";

import IndustryApplicants
    from "./pages/industry/IndustryApplicants";


import AcademicianDashboard
    from "./pages/academician/AcademicianDashboard";

import InstitutionDashboard
    from "./pages/institution/InstitutionDashboard";


import "./index.css";

import "./App.css";


const API_URL = import.meta.env.VITE_API_URL;


/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage() {

    const navigate = useNavigate();

    const roles = [

        {
            id: "student",
            title: "Student",
            icon: "🎓",
            description:
                "Build your skill profile and discover opportunities."
        },

        {
            id: "industry",
            title: "Industry",
            icon: "🏢",
            description:
                "Find skilled students and post opportunities."
        },

        {
            id: "academician",
            title: "Academician",
            icon: "👥",
            description:
                "Track student skills and identify skill gaps."
        },

        {
            id: "institution",
            title: "Institution",
            icon: "🏛",
            description:
                "Monitor skills, opportunities and outcomes."
        }

    ];


    return (

        <div className="landing-page">

            <div className="background-stars"></div>


            <header className="top-header">

                <div className="brand">

                    <div className="brand-icon">
                        SB
                    </div>

                    <span>
                        SkillBridge
                    </span>

                </div>

            </header>


            <main className="landing-content">

                <section className="hero-section">

                    <div className="hero-content">

                        <div className="small-label">
                            SKILL • OPPORTUNITY • GROWTH
                        </div>


                        <h1>

                            One Portal,

                            <br />

                            <span>
                                Four Roles.
                            </span>

                        </h1>


                        <p>

                            Students, industries, academicians,
                            and institutions — connected around
                            one verified skill profile.

                        </p>

                    </div>

                </section>


                <section className="role-section">

                    <div className="welcome-card">

                        <div className="welcome-heading">

                            <h2>
                                Welcome!
                            </h2>

                            <p>
                                Choose how you're joining
                                the portal today.
                            </p>

                        </div>


                        <div className="role-list">

                            {roles.map(
                                role => (

                                    <button
                                        key={role.id}
                                        className={
                                            `role-card ${role.id}`
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/login/${role.id}`
                                            )
                                        }
                                    >

                                        <div className="role-card-icon">

                                            {role.icon}

                                        </div>


                                        <div className="role-card-content">

                                            <span className="role-title">

                                                {role.title}

                                            </span>


                                            <span className="role-arrow">
                                                →
                                            </span>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}


/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage() {

    const navigate = useNavigate();

    const { role } = useParams();


    const roleData = {

        student: {
            title: "Student",
            icon: "🎓",
            description:
                "Build your skill profile and discover opportunities."
        },

        industry: {
            title: "Industry",
            icon: "🏢",
            description:
                "Find skilled students and post opportunities."
        },

        academician: {
            title: "Academician",
            icon: "👥",
            description:
                "Track student skills and identify skill gaps."
        },

        institution: {
            title: "Institution",
            icon: "🏛",
            description:
                "Monitor skills, opportunities and outcomes."
        }

    };


    const currentRole =
        roleData[role] ||
        roleData.student;


    const [mode, setMode] =
        useState("login");


    const [formData, setFormData] =
        useState({

            name: "",
            email: "",
            password: ""

        });


    const [message, setMessage] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const handleChange =
        event => {

            setFormData({

                ...formData,

                [event.target.name]:
                    event.target.value

            });

            setMessage("");
        };


    const handleSubmit =
        async event => {

            event.preventDefault();

            setLoading(true);

            setMessage("");


            try {

                const endpoint =
                    mode === "login"
                        ? "/api/auth/login"
                        : "/api/auth/register";


                const body =
                    mode === "login"

                        ? {

                            email:
                                formData.email,

                            password:
                                formData.password,

                            role:
                                role

                        }

                        : {

                            name:
                                formData.name,

                            email:
                                formData.email,

                            password:
                                formData.password,

                            role:
                                role

                        };


                const response =
                    await fetch(
                        `${API_URL}${endpoint}`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(body)

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Something went wrong"
                    );
                }


                if (
                    mode === "register"
                ) {

                    setMessage(
                        "Account created successfully. Please login."
                    );

                    setMode("login");

                    setFormData({

                        name: "",

                        email:
                            formData.email,

                        password: ""

                    });

                    return;
                }


                localStorage.setItem(
                    "skillbridge_token",
                    data.token
                );


                localStorage.setItem(
                    "skillbridge_user",
                    JSON.stringify(
                        data.user
                    )
                );


                navigate(
                    `/dashboard/${data.user.role}`
                );


            } catch (error) {

                setMessage(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };


    return (

        <div className="auth-page">

            <div className="background-stars"></div>


            <header className="top-header">

                <div className="brand">

                    <div className="brand-icon">
                        SB
                    </div>

                    <span>
                        SkillBridge
                    </span>

                </div>

            </header>


            <main className="auth-container">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ← Back
                </button>


                <div className="auth-card">

                    <div className="role-icon">
                        {currentRole.icon}
                    </div>


                    <h1>

                        {mode === "login"
                            ? `Welcome, ${currentRole.title}`
                            : "Join SkillBridge"}

                    </h1>


                    <p className="auth-subtitle">

                        {currentRole.description}

                    </p>


                    <form
                        className="auth-form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {mode === "register" && (

                            <>

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                    required
                                />

                            </>

                        )}


                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            required
                        />


                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password"
                            minLength="6"
                            required
                        />


                        {message && (

                            <div
                                className={
                                    message.includes(
                                        "successfully"
                                    )
                                        ? "success-message"
                                        : "error-message"
                                }
                            >

                                {message}

                            </div>

                        )}


                        <button
                            type="submit"
                            className="login-button"
                            disabled={
                                loading
                            }
                        >

                            {loading
                                ? "Please wait..."
                                : mode === "login"
                                    ? "Login"
                                    : "Create Account"}

                        </button>

                    </form>


                    <div className="auth-switch">

                        {mode === "login" ? (

                            <>

                                <span>
                                    Don't have an account?
                                </span>

                                <button
                                    onClick={() => {
                                        setMode(
                                            "register"
                                        );
                                        setMessage("");
                                    }}
                                >
                                    Create Account
                                </button>

                            </>

                        ) : (

                            <>

                                <span>
                                    Already have an account?
                                </span>

                                <button
                                    onClick={() => {
                                        setMode(
                                            "login"
                                        );
                                        setMessage("");
                                    }}
                                >
                                    Login
                                </button>

                            </>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
    role,
    children
}) {

    const token =
        localStorage.getItem(
            "skillbridge_token"
        );


    const storedUser =
        localStorage.getItem(
            "skillbridge_user"
        );


    if (!token || !storedUser) {

        return (
            <Navigate
                to={`/login/${role}`}
                replace
            />
        );
    }


    let user;

    try {

        user =
            JSON.parse(
                storedUser
            );

    } catch {

        localStorage.removeItem(
            "skillbridge_user"
        );

        localStorage.removeItem(
            "skillbridge_token"
        );

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    if (user.role !== role) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
}


/* =========================================================
   APP
========================================================= */

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <LandingPage />
                    }
                />


                <Route
                    path="/login/:role"
                    element={
                        <AuthPage />
                    }
                />


                {/* ================= STUDENT ================= */}

                <Route
                    path="/dashboard/student"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/student/assessment"
                    element={
                        <ProtectedRoute role="student">
                            <StudentAssessment />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/student/skills"
                    element={
                        <ProtectedRoute role="student">
                            <StudentSkillProfile />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/student/opportunities"
                    element={
                        <ProtectedRoute role="student">
                            <StudentOpportunities />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/student/applications"
                    element={
                        <ProtectedRoute role="student">
                            <StudentApplications />
                        </ProtectedRoute>
                    }
                />


                {/* ================= INDUSTRY ================= */}

                <Route
                    path="/dashboard/industry"
                    element={
                        <ProtectedRoute role="industry">
                            <IndustryDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/industry/post"
                    element={
                        <ProtectedRoute role="industry">
                            <IndustryPostJob />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/industry/jobs"
                    element={
                        <ProtectedRoute role="industry">
                            <IndustryJobs />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard/industry/applicants"
                    element={
                        <ProtectedRoute role="industry">
                            <IndustryApplicants />
                        </ProtectedRoute>
                    }
                />


                {/* ================= ACADEMICIAN ================= */}

                <Route
                    path="/dashboard/academician"
                    element={
                        <ProtectedRoute role="academician">
                            <AcademicianDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= INSTITUTION ================= */}

                <Route
                    path="/dashboard/institution"
                    element={
                        <ProtectedRoute role="institution">
                            <InstitutionDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= FALLBACK ================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;