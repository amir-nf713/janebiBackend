const express = require('express');
const router = express.Router();

const adminRouter = require("./admin")


router.get("/", adminRouter.getAdmin)
router.get("/:num", adminRouter.getOneAdmin)
router.get('/add/admin/to/data/base/:number', adminRouter.addAdmin)



module.exports = router;