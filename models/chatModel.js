const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        groupImg: {
            type: String,
        },
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        latestMessage: {
            type: mongoose.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;