const express = require('express');
const router = express.Router();

const users = require('./user')

router.get("/:num", users.getOneUser)
router.get("/", users.getAllUser)
router.post("/", users.postUser)
router.post("/addCash", users.updateCash)
router.post("/updateCodeGift", users.updateCodeGift)
router.put("/:num", users.updateUser)
router.delete("/:num", users.deleteUser)
router.post("/sendSms/random", users.postMessage)

module.exports = router;