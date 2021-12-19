const express = require('express');
const router = express.Router();
const { register, login, helloworld } = require('../controllers/auth');

router
  .route('/register')
  .post(register)

router
  .route('/login')
  .get(login)

// router
//   .route('/')
//   .get(helloworld)

module.exports = router;