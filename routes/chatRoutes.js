const { getAllChats, createSingleChat, createGroupChat, removeGroupChat, editGroupDetails } = require("../controllers/Chat");
const chatRoutes = require("express").Router();
const { auth } = require("../middlewares/auth");

chatRoutes.get("/fetchAllChats", auth, getAllChats);
chatRoutes.post("/create-single-chat", auth, createSingleChat);
chatRoutes.post("/create-group-chat", auth, createGroupChat);
chatRoutes.put("/edit-group-details", auth, editGroupDetails);
chatRoutes.delete("/remove-group-chat/:chatId", auth, removeGroupChat);

module.exports = chatRoutes;