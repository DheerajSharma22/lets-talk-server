const { getChatMessages, sendMessage } = require("../controllers/Message");
const { auth } = require("../middlewares/auth");
const messageRoute = require("express").Router();

messageRoute.post("/sendMessage", auth, sendMessage);
messageRoute.get("/getChatMessages/:chatId", auth, getChatMessages);

module.exports = messageRoute;