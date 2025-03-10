const express = require("express")
const router = express.Router()

const basket = require("./basket")

router.get("/", basket.getBasket)
router.get("/:id", basket.getOneBasket)
router.post("/", basket.postBasket)
router.put("/:shenase", basket.putBasket)



module.exports = router