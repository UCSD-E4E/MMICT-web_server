const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

router
  .use(requireAuth)
  .route('/')
  .get(userController.getUsers);

module.exports = router;