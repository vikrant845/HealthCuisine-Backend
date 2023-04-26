const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/').get(userController.getAll).post(userController.addOne);
router.post('/login', authController.login);
router.post('/signup', authController.signUp);
router.post('/verify', userController.verify);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/logout', authController.logout);

module.exports = router;