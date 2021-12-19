const express = require('express');
const router = express.Router();
const { send, getAllMessages, getAllUsers, getLastMessages } = require('../controllers/message');
const { isLoggedIn } = require('../middleware/authenticate')

router.post('/specific', isLoggedIn, send)

router.get('/specific', isLoggedIn, getAllMessages)

router.get('/getallusers', isLoggedIn, getAllUsers)

router.get('/getlastmessages', isLoggedIn, getLastMessages)

module.exports = router;