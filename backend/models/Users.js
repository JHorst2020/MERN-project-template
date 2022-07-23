const mongoose = require("mongoose")

const PermissionsSchema = new mongoose.Schema({
    role:{
        type: String,
        default:null
    },

})

const User = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    cellphone:{
        type:String,
        default:null
    },
    phone2:{
        type:String,
        default:null
    },
    backupEmail:{
        type:String,
        default:null
    },
    firstName:{
        type:String,
        default:null
    },
    lastName:{
        type:String,
        default:null
    },
    status:{
        type:String,
        default:null
    },
    status:{
        type:String,
        default:null
    },
    permissions:[PermissionsSchema],
    refreshToken:{
        type:String,
        default:null
    }
})

module.exports = mongoose.model("User", User)