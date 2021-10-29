const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/passwordReset', authController.getPasswordReset);

router.post('/passwordReset', authController.postReset);

router.get('passwordReset/:token', authController.getNewPassword);

router.post('/newPassword', authController.postNewPassword);

module.exports = router;
