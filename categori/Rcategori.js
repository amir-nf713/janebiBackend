const express = require("express")
const router = express.Router()

const categori = require("./categori")

router.get("/", categori.getcategori)
router.post("/", categori.postcategori)
router.delete("/:id", categori.deletecategori)


module.exports = router