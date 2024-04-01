const MessageModel = require("../models/messageModel");
const ChatModel = require('../models/chatModel')
const { uploadFileToCloudinary } = require("../utils/imageUploader");

const sendMessage = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        const sender = req.user?.id;
        const file = req.files?.file;

        // Validating if any field is undefined.
        if ((!message && !file) || !chatId || !sender) return res.status(400).send("Please fill all the fields");


        let createdMessage;
        let sendedFile;
        if (file) {
            sendedFile = await uploadFileToCloudinary(file, process.env.FOLDER_NAME);

            createdMessage = await MessageModel.create({
                file: sendedFile?.secure_url,
                chat: chatId,
                sender,
                fileName: file?.name,
            });

        } else {
            createdMessage = await MessageModel.create({
                message,
                chat: chatId,
                sender,
            });
        }

        // Populate the full message
        const fullMessage = await MessageModel.findById(createdMessage?._id).populate("sender").populate("chat");

        // Updating this message in chat's latest message section
        await ChatModel.findByIdAndUpdate(chatId, {
            $set: { latestMessage: createdMessage }
        });

        return res.status(200).json({
            success: true,
            message: "Message send successfully",
            createdMessage: fullMessage,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) return res.status(400).send("Chat id is not received");

        const messages = await MessageModel.find({ chat: chatId }).populate("sender").populate("chat");

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}

module.exports = { sendMessage, getChatMessages };