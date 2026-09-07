const authorize = (...roles) => {

    return (req, res, next) => {

        // Check if user's role is allowed
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        // Role is allowed
        next();
    };

};


module.exports = authorize;