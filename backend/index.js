require("dotenv").config()
const multer = require("multer")
const helmet = require("helmet")
const mongoose = require('mongoose')
const express = require("express")
const upload = multer({dest:"uploads"})
const routes = require("./routes")
const app = express()
const cors = require("cors")

app.use(cors());

app.use(helmet({
    contentSecurityPolicy: false,
}))

app.use(express.json())


app.use(routes)
mongoose.connect(process.env.DATABASE_URL) 
mongoose.Promise = Promise

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT}`)
})

module.exports = app 