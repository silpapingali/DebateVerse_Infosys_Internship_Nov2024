const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true}
})

const UsersModel = mongoose.model("user",UsersSchema)
module.exports = UsersModel