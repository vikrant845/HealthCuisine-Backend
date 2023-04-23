const express = require('express');

const authController = require('../controllers/authController');
const exerciseController = require('../controllers/exerciseController');

const router = express.Router({ mergeParams: true });

router.patch('/like', authController.protect, exerciseController.likeUnlike('like'));
router.patch('/unlike', authController.protect, exerciseController.likeUnlike('unlike'));
router.patch('/addOngoing', authController.protect, exerciseController.addToOngoing);
router.patch('/removeOngoing', authController.protect, exerciseController.removeFromOngoing);

module.exports = router;