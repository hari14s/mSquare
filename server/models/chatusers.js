const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    id : Number,
    name: String,
    user: String,
    pass: String
})

const userModel = mongoose.model("chatusers",userSchema)
module.exports = userModel