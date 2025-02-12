const express = require('express');
const router = express.Router();

const SendSMS = require('./sendSMS')

router.post('/smsSend', SendSMS.senSMS)

module.exports = router;