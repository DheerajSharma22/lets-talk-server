const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    file: {
        type: String,
    },
    fileName: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    }
},
    { timestamps: true });

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;