const express = require("express")
const router = express.Router()

const basket = require("./basket")

router.get("/", basket.getBasket)
router.post("/", basket.postBasket)

router.post("/pay", basket.pay)
router.get("/verify", basket.verify) // این باید قبل از `/:id` باشه

router.get("/:id", basket.getOneBasket)
router.put("/:shenase", basket.putBasket)




module.exports = router