exports.isAdmin = (req, res, next) => {
    if (req.session.userId.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: "Ez duzu baimenik ekintza hau burutzeko"
        });
    }
    next();
};