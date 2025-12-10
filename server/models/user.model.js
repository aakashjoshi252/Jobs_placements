const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["candidate", "recruiter", "admin"],
        required: true,
        default: "candidate",

    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
},
    { timestamps: true, versionKey: false });

const Users = mongoose.model("Users", usersSchema)
module.exports = Users;