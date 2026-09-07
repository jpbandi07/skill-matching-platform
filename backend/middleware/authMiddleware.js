const jwt = require("jsonwebtoken");


const protect = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;


        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });

        }


        // Get token from:
        // Authorization: Bearer TOKEN
        const token = authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message: "Invalid token"
            });

        }


        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store user information
        // inside request
        req.user = decoded;


        // Continue to next function
        next();


    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};


module.exports = protect;