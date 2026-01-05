const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const {validatePlayerUpdate} = require("../middleware/validatorMiddleware");

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/', adminController.getAdminDashboard);
router.get('/players/new', adminController.getNewPlayerForm);
router.post('/players/new', validatePlayerUpdate, adminController.postNewPlayer);
router.get('/players/edit/:id', adminController.getEditPlayerForm);
router.put('/players/edit/:id', validatePlayerUpdate, adminController.putEditPlayer);
router.delete('/players/delete/:id', adminController.deletePlayer);

module.exports = router;