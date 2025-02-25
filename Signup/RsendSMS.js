const express = require('express');
const router = express.Router();

const SendSMS = require('./sendSMS')

router.post('/smsSend', SendSMS.sendSMS)

module.exports = router;

