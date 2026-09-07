require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const matchingRoutes = require("./routes/matchingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/matching", matchingRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Skill Matching Platform Backend is running!"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            message: "Database connected successfully",
            result: rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});