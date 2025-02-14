const express = require("express")
const router = express.Router()
  const offerCode = require("./offer")

  router.get("/" , offerCode.getcode)
  router.post("/" , offerCode.postcode)
  router.delete("/:id" , offerCode.deleteGif)

module.exports = router