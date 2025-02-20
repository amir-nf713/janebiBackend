const express = require('express');
const router = express.Router();

const adminRouter = require("./admin")


router.get("/", adminRouter.getAdmin)
router.get('/add/admin/to/data/base/:number', adminRouter.addAdmin)
'/api/admin/add/admin/to/data/base/:09336230914'


module.exports = router;