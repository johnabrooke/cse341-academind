const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('password', 'Please enter a valid password, with at least 8 characters.')
        .isLength({ min: 8 })
],
    authController.postLogin);

router.post(
    '/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email address is forbidden.');
                // }
                // return true;
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('An account with that email already exists.  Please login.'
                            )
                            .catch(err => {
                                console.log(err);
                                res.redirect('/login');
                            });
                        }
                    });
            }),
        body(
            'password',
            'Please enter a password with at least 8 characters.'
        )
            .isLength({ min: 8 }),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match.');
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/passwordReset', authController.getPasswordReset);

router.post('/passwordReset', authController.postReset);

router.get('passwordReset/:token', authController.getNewPassword);

router.post('/newPassword', authController.postNewPassword);

module.exports = router;
