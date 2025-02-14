const express = require("express")
const router = express.Router()

const Kala = require("./kala")

router.get("/", Kala.getkala)
router.post("/", Kala.postkala)
router.put("/:shenase", Kala.putkala)
router.delete("/:shenase", Kala.deletkala)


module.exports = router