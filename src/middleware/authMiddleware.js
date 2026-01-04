exports.isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            success: false,
            error: "Ez zaude autentikatuta"
        })
    }
    next();
};