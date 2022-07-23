const express = require("express")
const asyncHandler = require("express-async-handler");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const User = require("../../../models/Users")
const router = express.Router();

const jwt = require("jsonwebtoken");
const {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require("../../../utils/token")

router.get("/ping", authenticateToken, asyncHandler(async(req, res) => {
    return res.sendStatus(200)
}))


module.exports = router