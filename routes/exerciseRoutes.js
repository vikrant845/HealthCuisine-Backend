const express = require('express');

const actionRouter = require('../routes/actionRoutes');
const exerciseController = require('../controllers/exerciseController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:exerciseId/action', actionRouter);
router.route('/').get(authController.protect, exerciseController.getAll).post(authController.protect, exerciseController.addOne);
router.get('/search/:searchQuery', authController.protect, exerciseController.search);
router.get('/:id', exerciseController.getOne);
router.get('/bodyPart', exerciseController.bodyPart);
router.get('/target', exerciseController.target);

module.exports = router;