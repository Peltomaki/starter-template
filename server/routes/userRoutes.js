const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyJwt } = require('../middleware/verifyJwt');
const { verifyRoles } = require('../middleware/verifyRoles');
const user = require('../models/user');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', verifyJwt, authController.updatePassword);
router.patch('/updateCurrentUser', verifyJwt, userController.updateCurrentUser);
router.get(
  '/',
  verifyJwt,
  verifyRoles('admin', 'admin'),
  userController.getAllUsers
);

module.exports = router;
