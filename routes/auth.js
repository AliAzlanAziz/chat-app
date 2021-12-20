const express = require('express');
const router = express.Router();
const { register, login, helloworld } = require('../controllers/auth');

router
  .route('/register')
  .post(register)

router
  .route('/login')
  .post(login)

  //just to test if api is working, get http://localhost:5000/api/v1/auth/ to test
router
  .route('/')
  .get(helloworld)

module.exports = router;