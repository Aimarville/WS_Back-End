const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/register', authController.register);

router.get('/login', authController.getLoginView);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

// Register/login/logout frogetarako
router.get('/admin-test',
    isAuthenticated,
    isAdmin,
    (req, res) => {
        res.json({ message: 'Admin OK' });
});

module.exports = router;