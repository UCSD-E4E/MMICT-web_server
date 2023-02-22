const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/login')
  .get(authController.login);

router
  .route('/signup')
  .get(authController.signUp);

module.exports = router;