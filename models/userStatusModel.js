const mongoose = require("mongoose");

const UserStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},
    { timestamps: true });


module.exports = mongoose.model("UserStatus", UserStatusSchema);