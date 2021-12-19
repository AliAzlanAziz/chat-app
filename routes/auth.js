const express = require('express');
const router = express.Router();
const { register, login, helloworld } = require('../controllers/auth');

router
  .route('/register')
  .post(register)

router
  .route('/login')
  .post(login)

router
  .route('/')
  .get(helloworld)

module.exports = router;