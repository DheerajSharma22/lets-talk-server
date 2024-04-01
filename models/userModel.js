const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    phone: {
        type: Number,
    },
    token: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
        default: Date.now() + 3600000
    }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
