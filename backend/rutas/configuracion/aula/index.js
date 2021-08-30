const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")

router.use(bodyparser.json())




module.exports= router