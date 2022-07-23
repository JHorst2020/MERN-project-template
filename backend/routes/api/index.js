const express = require("express")
const {Router} = require("express")
const userRouter = require("./v1/users")
const authRouter = require("./v1/auth")
const testRouter = require("./v1/test")

const router = new Router()

router.use("/v1/users", userRouter)
router.use("/v1/auth", authRouter)
router.use("/v1/test", testRouter)

module.exports = router;
