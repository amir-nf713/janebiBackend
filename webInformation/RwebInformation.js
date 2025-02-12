const express = require('express');
const router = express.Router();

const webData = require("./webInformation")

router.get("/", webData.getInformation)
router.get("/add/web/data/in/data/base/", webData.addInformation)
router.put("/", webData.updateInformation)

module.exports = router;