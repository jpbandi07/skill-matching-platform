import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import "../../App.css";


const API_URL = import.meta.env.VITE_API_URL;


const skills = [

    { id: 1, name: "JavaScript" },

    { id: 2, name: "Python" },

    { id: 3, name: "SQL" },

    { id: 4, name: "Data Structures" },

    { id: 5, name: "Problem Solving" },

    { id: 6, name: "Communication" },

    { id: 7, name: "Teamwork" },

    { id: 8, name: "Leadership" },

    { id: 9, name: "Logical Reasoning" },

    { id: 10, name: "Critical Thinking" }

];


function IndustryPostJob() {

    const navigate = useNavigate();


    const storedUser =
        localStorage.getItem(
            "skillbridge_user"
        );


    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    const [form, setForm] = useState({

        title: "",

        description: "",

        type: "job",

        location: "",

        salary: "",

        duration: ""

    });


    const [selectedSkills, setSelectedSkills] =
        useState([]);


    const [message, setMessage] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    if (!user) {

        navigate("/");

        return null;
    }


    const handleChange = event => {

        setForm({

            ...form,

            [event.target.name]:
                event.target.value

        });

        setMessage("");
    };


    const toggleSkill = skillId => {

        setSelectedSkills(previous => {

            const exists =
                previous.find(
                    item =>
                        item.skill_id === skillId
                );


            if (exists) {

                return previous.filter(
                    item =>
                        item.skill_id !== skillId
                );
            }


            return [

                ...previous,

                {
                    skill_id: skillId,

                    required_proficiency: 3
                }

            ];

        });
    };


    const changeProficiency = (
        skillId,
        value
    ) => {

        setSelectedSkills(
            previous =>
                previous.map(
                    item =>
                        item.skill_id === skillId
                            ? {
                                ...item,

                                required_proficiency:
                                    Number(value)
                            }
                            : item
                )
        );
    };


    const submitJob = async event => {

        event.preventDefault();


        if (
            selectedSkills.length === 0
        ) {

            setMessage(
                "Please select at least one required skill."
            );

            return;
        }


        const token =
            localStorage.getItem(
                "skillbridge_token"
            );


        setLoading(true);

        setMessage("");


        try {

            const response =
                await fetch(
                    `${API_URL}/api/jobs`,
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

                                ...form,

                                required_skills:
                                    selectedSkills

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to post opportunity"
                );
            }


            setMessage(
                "Opportunity posted successfully."
            );


            setTimeout(() => {

                navigate(
                    "/dashboard/industry/jobs"
                );

            }, 800);


        } catch (error) {

            setMessage(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <DashboardLayout

            role="industry"

            user={user}

            title="Post Opportunity"

            subtitle="Create a job or internship and define the skills you need."
        >


            <form
                className="job-form-container"
                onSubmit={submitJob}
            >


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Opportunity Details
                            </div>

                            <div className="card-description">
                                Add the details students need to understand the role.
                            </div>

                        </div>

                    </div>


                    <div className="card-body">

                        <div className="form-grid">


                            <div className="form-field full">

                                <label>
                                    Opportunity Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Software Engineer Intern"
                                    required
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                >

                                    <option value="job">
                                        Job
                                    </option>

                                    <option value="internship">
                                        Internship
                                    </option>

                                </select>

                            </div>


                            <div className="form-field">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Remote / Mumbai"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Salary / Stipend
                                </label>

                                <input
                                    type="text"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="₹25,000 / month"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="6 months"
                                />

                            </div>


                            <div className="form-field full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe responsibilities, expectations and role details..."
                                    rows="7"
                                ></textarea>

                            </div>


                        </div>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <div className="card-title">
                                Required Skills
                            </div>

                            <div className="card-description">
                                Select skills and set the minimum proficiency level.
                            </div>

                        </div>


                        <span className="selected-skills-count">

                            {selectedSkills.length} selected

                        </span>

                    </div>


                    <div className="card-body">

                        <div className="required-skills-grid">

                            {skills.map(skill => {

                                const selected =
                                    selectedSkills.find(
                                        item =>
                                            item.skill_id ===
                                            skill.id
                                    );


                                return (

                                    <div
                                        className={
                                            `required-skill-item ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`
                                        }
                                        key={skill.id}
                                    >

                                        <button
                                            type="button"
                                            className="skill-select-button"
                                            onClick={() =>
                                                toggleSkill(
                                                    skill.id
                                                )
                                            }
                                        >

                                            <span className="skill-select-check">

                                                {selected
                                                    ? "✓"
                                                    : ""}

                                            </span>

                                            <span>
                                                {skill.name}
                                            </span>

                                        </button>


                                        {selected && (

                                            <select
                                                value={
                                                    selected.required_proficiency
                                                }
                                                onChange={
                                                    event =>
                                                        changeProficiency(
                                                            skill.id,
                                                            event.target.value
                                                        )
                                                }
                                            >

                                                <option value="1">
                                                    Level 1
                                                </option>

                                                <option value="2">
                                                    Level 2
                                                </option>

                                                <option value="3">
                                                    Level 3
                                                </option>

                                                <option value="4">
                                                    Level 4
                                                </option>

                                                <option value="5">
                                                    Level 5
                                                </option>

                                            </select>

                                        )}

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                </div>


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


                <div className="job-form-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/industry"
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Publishing..."
                            : "Publish Opportunity →"}

                    </button>

                </div>


            </form>

        </DashboardLayout>
    );
}


export default IndustryPostJob;