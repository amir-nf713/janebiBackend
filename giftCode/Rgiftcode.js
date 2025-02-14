const express = require("express")
const router = express.Router()
  const GiftCode = require("./giftcode")

  router.get("/" , GiftCode.getcode)
  router.post("/" , GiftCode.postcode)
  router.delete("/:id" , GiftCode.deleteGif)

module.exports = router