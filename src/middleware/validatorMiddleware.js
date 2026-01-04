const { body, validationResult } = require('express-validator');
const validatePlayerUpdate = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 1, max:50 })
        .withMessage('Name must have at least 1 characters and max 50'),
    body('teamId')
        .notEmpty()
        .withMessage('Team cannot be empty'),
    body('leagueId')
        .notEmpty()
        .withMessage('League cannot be empty'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Datu baliogabeak',
                    details: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg
                    }))
                }
            });
        }
        next();
    }
];

module.exports = { validatePlayerUpdate };