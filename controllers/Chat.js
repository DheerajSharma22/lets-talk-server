const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");
const { uploadFileToCloudinary } = require("../utils/imageUploader");

const getAllChats = async (req, res) => {
    try {
        const Chats = await ChatModel.find({
            users: { $elemMatch: { $eq: req.user.id } }
        }).populate("latestMessage").populate("users").populate("groupAdmin").exec();


        return res.status(200).json({
            success: true,
            chats: Chats
        });
    } catch (error) {
        console.log("Get all chats error", error);
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

// Also, we can say that receive request
const createSingleChat = async (req, res) => {
    try {
        const { receiverId } = req.body;

        if (!receiverId) return res.status(400).json({
            success: false,
            message: "Receiver's id is not received",
        });

        // Check if chat exists
        const chatExists = await ChatModel.findOne({
            isGroupChat: false,
            users: [receiverId, req?.user?.id]
        }).populate("latestMessage").populate("users");

        if (chatExists) return res.status(200).json({
            chat: chatExists,
            success: true,
            message: "Chat fetched successfully...",
        });

        // Create new chat
        let createdChat = await ChatModel.create({
            users: [receiverId, req?.user?.id],
            chatName: "sender",
        });

        const fullChat = await ChatModel.findById(createdChat?._id).populate("latestMessage").populate("users");

        return res.status(200).json({
            success: true,
            chat: fullChat,
            message: "Chat created successfully...",
            chatCreated: true,
        })
    } catch (error) {
        console.log("Create chat error", error);
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

const createGroupChat = async (req, res) => {
    try {
        let { chatName, users } = req.body;
        const image = req.files?.groupImage;
        const groupAdmin = req.user;

        console.log(users);

        // Validate all details
        if (!chatName || !image) return res.status(400).json({
            success: false,
            message: "Please provide all the details",
        });

        users = JSON.parse(users);
        if (!users || users.length === 0) return res.status(400).json({
            success: false,
            message: "There must be atleast 2 users to create a group"
        });

        // Check if chat already exists
        const chatExists = await ChatModel.findOne({
            chatName,
            users: [...users, groupAdmin?.id]
        }).populate("latestMessage").populate("users").populate("groupAdmin");

        if (chatExists) return res.status(200).json({
            success: true,
            chat: chatExists,
        })

        // If chat not exists, then create one

        // First upload group image on cloudinary
        const uploadedGroupImage = await uploadFileToCloudinary(image, process.env.FOLDER_NAME);

        // Check for error
        if (!uploadedGroupImage) return res.status(400).json({
            success: false,
            message: "Error occured on uploading group image",
        });

        // Now create the chat
        const createdChat = await ChatModel.create({
            chatName,
            isGroupChat: true,
            groupImg: uploadedGroupImage?.secure_url,
            users: [...users, groupAdmin?.id],
            groupAdmin: groupAdmin?.id
        });

        // Populate all the details of created chat
        const fullChat = await ChatModel.findById(createdChat?._id).populate("latestMessage").populate("users").populate("groupAdmin");

        // return the response 
        return res.status(200).json({
            success: true,
            message: "Group created successfully",
            chat: fullChat,
            chatCreated: true,
        })
    } catch (error) {
        console.log("Create Group Chat Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error" + error.message,
        })
    }
}

const editGroupDetails = async (req, res) => {
    try {
        let { chatId, chatName, users } = req.body;
        const groupImage = req.files?.groupImage;

        users = JSON.parse(users)

        const groupAdminExist = users.filter((usr) => usr?._id === req.user.id);
        
        if (groupAdminExist?.length === 0) return res.status(400).json({
            success: false,
            message: "Group admin can not be deleted!",
        })
        
        // validate
        if (!chatId) return res.status(400).json({
            success: false,
            message: "Group id not found!",
        });


        // Find whether the chat is exists or not with this chatId
        let chat = await ChatModel.findById(chatId).populate("groupAdmin");
        if (!chat) return res.status(400).json({
            success: false,
            message: "Chat not exists",
        });

        // if image is updated
        if (groupImage) {
            const uploadImage = await uploadFileToCloudinary(groupImage, process.env.FOLDER_NAME);
            chat.groupImg = uploadImage?.secure_url;
        }

        // if name is updated
        if (chatName) {
            chat.chatName = chatName;
        }

        // if Members updated
        if (users) {
            chat.users = users;
        }

        chat = chat.populate('users');
        console.log(chat);
        // save the info in db
        await chat.save();

        // return the response
        return res.status(200).json({
            success: true,
            message: "Group Info Updated successfully",
            chat,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error?.message,
        })
    }
}

const removeGroupChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) return res.status(400).json({
            success: false,
            message: "Chat id is not found",
        });

        // Delete all messages related to this chat
        await MessageModel.deleteMany({ chat: chatId });

        // Finally delete the chat
        await ChatModel.findByIdAndDelete(chatId);

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error?.message,
        })
    }
}

module.exports = { getAllChats, createSingleChat, createGroupChat, editGroupDetails, removeGroupChat };