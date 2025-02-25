const express = require("express")
const router = express.Router()

const Kala = require("./kala")

router.get("/", Kala.getkala)
router.get("/new/", Kala.getnewkala)
router.get("/off/", Kala.getkalaOff)
router.get("/:id", Kala.getonekala)
router.post("/", Kala.postkala)
router.put("/:id", Kala.putkala)
router.delete("/:id", Kala.deletkala)


module.exports = router