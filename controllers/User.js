const UserModel = require("../models/userModel");
const userStatusModel = require("../models/userStatusModel");
const { uploadFileToCloudinary } = require("../utils/imageUploader");

const searchUsers = async (req, res) => {
    try {
        const { search } = req.params;

        // Validate
        if (!search) return res.status(400).send("Search query is not received...");


        const Users = await UserModel.find({
            username: new RegExp(search, 'i'),
            _id: { $ne: req.user.id },
        });

        return res.status(200).json({ success: true, results: Users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server errror",
            error,
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Validate
        if (!updates) return res.status(400).json({
            success: false,
            message: "Information not received for updation",
        });

        // Check for username.
        if (updates?.hasOwnProperty("username")) {
            // If the email already exits in db
            const userExists = await UserModel.findOne({ username: updates.username });
            if (userExists) return res.status(400).json({
                success: false,
                message: "This username is not available",
            })
        }

        // Find the user details
        const user = await UserModel.findById(req.user.id);

        // Update only those fields which are requested.
        for (const key in updates) {
            user[key] = updates[key];
        }

        // Save user details in db
        await user.save();

        return res.status(200).json({
            success: true,
            message: "user updated successfully",
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error?.message,
        })
    }
}

const updateProfilePic = async (req, res) => {
    try {
        const image = req.files?.image;

        // validate
        if (!image) return res.status(400).json({
            success: false,
            message: "Image is not received",
        });

        // Upload image on cloudinary
        const uploadedImage = await uploadFileToCloudinary(image, process.env.FOLDER_NAME);

        // Find user and update
        const user = await UserModel.findByIdAndUpdate(req.user.id, { image: uploadedImage?.secure_url }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Profile picture saved successfully",
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error?.message,
        })
    }
}

const getUserStatus = async (req, res) => {
    try {
        const onlineUsers = await userStatusModel.find({});
        if (!onlineUsers) return res.status(200).json({
            success: true,
            onlineUsers: []
        });

        return res.status(200).json({
            success: true,
            onlineUsers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error?.message,
        })
    }
}

module.exports = { searchUsers, updateProfile, updateProfilePic, getUserStatus };