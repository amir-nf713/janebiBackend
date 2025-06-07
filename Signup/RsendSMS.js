const express = require('express');
const router = express.Router();

const SendSMS = require('./sendSMS')

router.post('/smsSend', SendSMS.sendSMS)
router.post('/smsSendq', SendSMS.sendSMSbybas)
router.post('/smsSendc', SendSMS.sendSMSbycode)

module.exports = router;

