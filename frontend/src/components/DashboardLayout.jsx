import { useState } from "react";
import { useNavigate } from "react-router-dom";


function DashboardLayout({
    role,
    user,
    title,
    subtitle,
    children
}) {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // ==========================================
    // ROLE CONFIGURATION
    // ==========================================

    const roleConfig = {

        student: {

            label: "Student",

            icon: "🎓",

            navigation: [

                {
                    label: "Dashboard",
                    icon: "⌂",
                    path: "/dashboard/student"
                },

                {
                    label: "Skill Assessment",
                    icon: "▣",
                    path: "/dashboard/student/assessment"
                },

                {
                    label: "Skill Profile",
                    icon: "◎",
                    path: "/dashboard/student/skills"
                },

                {
                    label: "Opportunities",
                    icon: "▤",
                    path: "/dashboard/student/opportunities"
                },

                {
                    label: "My Applications",
                    icon: "▥",
                    path: "/dashboard/student/applications"
                },

                {
                    label: "Portfolio",
                    icon: "♢",
                    path: "/dashboard/student/portfolio"
                }
            ]
        },


        industry: {

            label: "Industry",

            icon: "🏢",

            navigation: [

                {
                    label: "Dashboard",
                    icon: "⌂",
                    path: "/dashboard/industry"
                },

                {
                    label: "Post Opportunity",
                    icon: "＋",
                    path: "/dashboard/industry/post"
                },

                {
                    label: "My Opportunities",
                    icon: "▤",
                    path: "/dashboard/industry/jobs"
                },

                {
                    label: "Applicants",
                    icon: "♙",
                    path: "/dashboard/industry/applicants"
                },

                {
                    label: "Candidate Skills",
                    icon: "◎",
                    path: "/dashboard/industry/candidates"
                }
            ]
        },


        academician: {

            label: "Academician",

            icon: "👥",

            navigation: [

                {
                    label: "Dashboard",
                    icon: "⌂",
                    path: "/dashboard/academician"
                },

                {
                    label: "Students",
                    icon: "♙",
                    path: "/dashboard/academician/students"
                },

                {
                    label: "Skill Analytics",
                    icon: "▥",
                    path: "/dashboard/academician/skills"
                },

                {
                    label: "Skill Gaps",
                    icon: "△",
                    path: "/dashboard/academician/gaps"
                },

                {
                    label: "Assessment Insights",
                    icon: "▣",
                    path: "/dashboard/academician/assessment"
                }
            ]
        },


        institution: {

            label: "Institution",

            icon: "🏛",

            navigation: [

                {
                    label: "Dashboard",
                    icon: "⌂",
                    path: "/dashboard/institution"
                },

                {
                    label: "Overview",
                    icon: "◈",
                    path: "/dashboard/institution/overview"
                },

                {
                    label: "Students",
                    icon: "♙",
                    path: "/dashboard/institution/students"
                },

                {
                    label: "Skills",
                    icon: "◎",
                    path: "/dashboard/institution/skills"
                },

                {
                    label: "Opportunities",
                    icon: "▤",
                    path: "/dashboard/institution/opportunities"
                },

                {
                    label: "Applications",
                    icon: "▥",
                    path: "/dashboard/institution/applications"
                },

                {
                    label: "Analytics",
                    icon: "▦",
                    path: "/dashboard/institution/analytics"
                }
            ]
        }
    };


    const currentRole =
        roleConfig[role] ||
        roleConfig.student;


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem(
            "skillbridge_token"
        );

        localStorage.removeItem(
            "skillbridge_user"
        );

        navigate("/");
    };


    // ==========================================
    // NAVIGATION
    // ==========================================

    const handleNavigation = (path) => {

        navigate(path);

        setSidebarOpen(false);
    };


    // ==========================================
    // USER NAME
    // ==========================================

    const userName =
        user?.name ||
        "User";


    // ==========================================
    // INITIAL
    // ==========================================

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase();


    return (

        <div className="dashboard-page">


            {/* ======================================
                MOBILE OVERLAY
            ====================================== */}

            {sidebarOpen && (

                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                ></div>

            )}


            {/* ======================================
                SIDEBAR
            ====================================== */}

            <aside
                className={
                    `dashboard-sidebar ${
                        sidebarOpen
                            ? "sidebar-open"
                            : ""
                    }`
                }
            >


                {/* ==================================
                    BRAND
                ================================== */}

                <div className="sidebar-brand">

                    <div className="sidebar-brand-icon">

                        SB

                    </div>


                    <div>

                        <div className="sidebar-brand-name">

                            SkillBridge

                        </div>

                        <div className="sidebar-brand-tag">

                            SKILL • OPPORTUNITY

                        </div>

                    </div>

                </div>


                {/* ==================================
                    ACCOUNT
                ================================== */}

                <div className="sidebar-account">

                    <div className="account-avatar">

                        {userInitial}

                    </div>


                    <div className="account-info">

                        <div className="account-name">

                            {userName}

                        </div>

                        <div className="account-role">

                            {currentRole.label}

                        </div>

                    </div>


                    <div className="online-dot"></div>

                </div>


                {/* ==================================
                    NAVIGATION LABEL
                ================================== */}

                <div className="sidebar-section-label">

                    WORKSPACE

                </div>


                {/* ==================================
                    NAVIGATION
                ================================== */}

                <nav className="sidebar-navigation">

                    {currentRole.navigation.map(
                        (item) => (

                            <button
                                key={item.path}
                                className={
                                    "sidebar-nav-item"
                                }
                                onClick={() =>
                                    handleNavigation(
                                        item.path
                                    )
                                }
                            >

                                <span className="nav-icon">

                                    {item.icon}

                                </span>


                                <span className="nav-label">

                                    {item.label}

                                </span>


                                <span className="nav-chevron">

                                    › 

                                </span>

                            </button>

                        )
                    )}

                </nav>


                {/* ==================================
                    SIDEBAR BOTTOM
                ================================== */}

                <div className="sidebar-bottom">

                    <div className="sidebar-help">

                        <div className="help-icon">

                            ?

                        </div>


                        <div>

                            <div className="help-title">

                                Need help?

                            </div>

                            <div className="help-text">

                                We're here for you.

                            </div>

                        </div>

                    </div>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        <span className="logout-icon">

                            ↪

                        </span>


                        <span>

                            Log out

                        </span>

                    </button>

                </div>

            </aside>


            {/* ======================================
                MAIN AREA
            ====================================== */}

            <main className="dashboard-main">


                {/* ==================================
                    MOBILE HEADER
                ================================== */}

                <div className="mobile-dashboard-header">

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >

                        ☰

                    </button>


                    <div className="mobile-brand">

                        <div className="mobile-brand-icon">

                            SB

                        </div>

                        SkillBridge

                    </div>

                </div>


                {/* ==================================
                    TOP BAR
                ================================== */}

                <header className="dashboard-topbar">

                    <div>

                        <div className="breadcrumb">

                            SkillBridge

                            <span>
                                /
                            </span>

                            {currentRole.label}

                        </div>


                        <h1 className="dashboard-title">

                            {title}

                        </h1>


                        {subtitle && (

                            <p className="dashboard-subtitle">

                                {subtitle}

                            </p>

                        )}

                    </div>


                    <div className="dashboard-user">

                        <div className="topbar-status">

                            <span></span>

                            Online

                        </div>


                        <div className="topbar-avatar">

                            {userInitial}

                        </div>

                    </div>

                </header>


                {/* ==================================
                    PAGE CONTENT
                ================================== */}

                <section className="dashboard-content">

                    {children}

                </section>

            </main>

        </div>
    );
}


export default DashboardLayout;