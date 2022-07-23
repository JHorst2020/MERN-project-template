const express = require("express")
const asyncHandler = require("express-async-handler");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const User = require("../../../models/Users")
const { ObjectId } = require("bson");

const {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
} = require("../../../utils/token");
const { updateOne } = require("../../../models/Users");


//* SIGN UP
router.post("/sign-up", asyncHandler(async(req, res) => {
    const {username, email, password, cellphone, phone2, backupEmail, firstName, lastName} = req.body
    if(username == null || email == null || password == null){
        req.status = 400
        return res.json({error:'missing_info', message:"Information is missing."})
    }
    const checkUsername = await User.countDocuments({$or:[{username, username:email}]})
    const checkEmail = await User.countDocuments({$or:[{email, email: username}]})
    const errorObj = {}
    if(checkUsername > 0){
        errorObj.username = {
            error:"already_exists",
            errorMessage:"Username has already been taken."
        }
    }
    if(checkEmail > 0){
        errorObj.email = {
            error:"already_exists",
            errorMessage:"Email is already associated with an account."
        }
    }
    if(Object.keys(errorObj).length > 0){
        res.status(400)
        return res.json(errorObj)
    }
    const hashedPW = bcrypt.hashSync(password, 10 )

    const newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPW,
        status:"new",
        cellphone,
        phone2,
        backupEmail,
        firstName,
        lastName,
    })
    const accessToken = generateAccessToken({username, email, firstName, lastName, _id:newUser._id})
    const refreshToken = generateRefreshToken({username, email, firstName, lastName, _id:newUser._id})
    await User.updateOne({username},{refreshToken})
    return res.json({accessToken, refreshToken, loggedInUser:{username, email, firstName, lastName,  _id:newUser._id}})
}))

//* Username or Email and Password Login
router.post("/login", asyncHandler(async(req, res) => {
    const {credential, password} = req.body
    const findUser = await User.findOne({$or:[{email:credential.toLowerCase()},{username:credential.toLowerCase()}]})
    const checkPW = bcrypt.compareSync(password, findUser.password)
    if(checkPW === false){
        return res.sendStatus(401)
    }
    if(checkPW === true){
        const accessToken = generateAccessToken({username: findUser.username, email: findUser.email, firstName:findUser.firstName, lastName:findUser.lastName, _id:findUser._id})
        const refreshToken = generateRefreshToken({username: findUser.username, email: findUser.email, firstName:findUser.firstName, lastName:findUser.lastName, _id:findUser._id})
        await User.updateOne({_id:ObjectId(findUser._id)},{refreshToken})
        return res.json({accessToken, refreshToken, loggedInUser:{username: findUser.username, email: findUser.email, firstName:findUser.firstName, lastName:findUser.lastName, _id:findUser._id}})
    }
}))

router.delete("/logout", asyncHandler(async(req, res) => {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        const loggedInUser = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
            //* Doesn't matter if token is expired since it's only being used to log the user out
            if(err){
                throw new Error
            }
            console.log("User", user)
            return user
        })
        await User.updateOne({_id:ObjectId(loggedInUser._id)}, {refreshToken:null})
    }catch(e){
        const {_id} = req.body
        await User.updateOne({_id:ObjectId(_id)}, {refreshToken:null})
        console.log("Logged out this way")
    }
    return res.sendStatus(204)
}))




module.exports = router