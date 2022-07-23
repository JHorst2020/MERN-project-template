const jwt = require("jsonwebtoken");
const User = require("../models/Users")
const {ObjectId} = require("bson")

const createAccessToken = () => {
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET)
    return accessToken
}

// Authenticate Access Token
//* MIDDLEWARE
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null){
        res.status(401)
        return res.json({error:"forbidden"})
    }
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            res.status(403)
            return res.json({error:err})
        }
        req.loggedInUser = user
        next()
    })
}

const generateAccessToken = (user) => {
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN })
    return accessToken
}

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET)
    return refreshToken
}

const verifyRefreshToken = async(usersRefreshToken) => {
    jwt.verify(usersRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return null //TODO
        }
        return user
    })
}


exports.authenticateToken = authenticateToken
exports.createAccessToken = createAccessToken
exports.generateAccessToken = generateAccessToken
exports.generateRefreshToken = generateRefreshToken
exports.verifyRefreshToken = verifyRefreshToken