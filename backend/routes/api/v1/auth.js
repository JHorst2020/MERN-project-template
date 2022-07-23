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



router.post("/login", authenticateToken, asyncHandler(async(req, res) => {
    const user = req.loggedInUser
    const loggedInUser = {
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        username: user?.username,
        _id: user?._id
    }
    const accessToken = generateAccessToken(loggedInUser)
    const refreshToken = generateRefreshToken(loggedInUser)

    return res.json({accessToken:accessToken, refreshToken:refreshToken, user: loggedInUser})
}))

//! Use refresh token to generate access token
router.post("/token", asyncHandler(async(req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null){
        return res.sendStatus(401)
    }
    //* Find the user based upon the user id of the refresh token
    const refreshTokenMongoUser = await User.findOne({refreshToken:refreshToken})
    if(refreshTokenMongoUser == null){
        return res.sendStatus(401)
    }

    const refreshTokenUser = await verifyRefreshToken(refreshToken)

    if(refreshTokenUser == null){
        //* Return 401 status if refresh token is not valid
        return res.sendStatus(401)
    }

    //* If the refresh token is valid, generate a new access token 
    const loggedInUser = {
        username:refreshTokenUser.username,
        email: refreshTokenUser.email,
        firstName: refreshTokenUser.firstName,
        lastName: refreshTokenUser.lastName
    }
    const accessToken = generateAccessToken(loggedInUser)
    return res.json({accessToken, user:loggedInUser})
}))
 

router.delete('/logout', asyncHandler(async(req, res) => {

}))

module.exports = router