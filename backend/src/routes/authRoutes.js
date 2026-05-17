const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { userRegistrationValidation, loginValidation, validate } = require('../utils/validators');

router.post('/register', userRegistrationValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;