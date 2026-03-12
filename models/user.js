const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    image: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser"
    }

}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);