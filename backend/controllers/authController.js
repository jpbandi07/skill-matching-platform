const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // Check required fields
        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // All 4 roles
        const validRoles = [
            "student",
            "industry",
            "academician",
            "institution"
        ];


        // Check role
        if (!validRoles.includes(role)) {

            return res.status(400).json({
                message: "Invalid role"
            });

        }


        // Check existing email
        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (existingUsers.length > 0) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Insert user
        const [result] = await db.query(
            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                role
            ]
        );


        // Create student profile
        if (role === "student") {

            await db.query(
                `INSERT INTO students
                (user_id)
                VALUES (?)`,
                [result.insertId]
            );

        }


        res.status(201).json({

            message: "Registration successful",

            user: {
                id: result.insertId,
                name: name,
                email: email,
                role: role
            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

};



// ================= LOGIN =================

const login = async (req, res) => {

    try {

        const {
            email,
            password,
            role
        } = req.body;


        // Check required fields
        if (!email || !password || !role) {

            return res.status(400).json({
                message:
                    "Email, password and role are required"
            });

        }


        // Find user
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (users.length === 0) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        const user = users[0];


        // Check role
        if (user.role !== role) {

            return res.status(403).json({
                message:
                    "This account is registered as " +
                    user.role
            });

        }


        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // Login successful
        res.json({

            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

};



module.exports = {
    register,
    login
};