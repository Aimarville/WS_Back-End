const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.get('/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login'}), authController.oauthLogin);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login'}), authController.oauthLogin);

module.exports = router;