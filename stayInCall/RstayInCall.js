const express = require('express');
const router = express.Router();

const stayincall = require("./stayInCall")

router.get("/", stayincall.getallstayincall)
router.post("/", stayincall.postallstayincall)
router.delete("/:shenase", stayincall.deletestayincall)

module.exports = router;