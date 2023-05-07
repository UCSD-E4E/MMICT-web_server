const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

router
  .route('/')
  .get(userController.getUsers);

module.exports = router;