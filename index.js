const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/auth");
const messageRoute = require("./routes/messageRoute");
const userRotes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userStatusModel = require("./models/userStatusModel");

// Defining port
const PORT = process.env.PORT || 5000;

// Config
dotenv.config();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

// Connections
connectToDB();
cloudinaryConnect();

// Defining routes
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoute);
app.use("/api/users", userRotes);
app.use("/api/chat", chatRoutes);



// Starting app server
const server = app.listen(PORT, () => {
    console.log("Listening at port no. ", PORT);
});

const io = require('socket.io')(server, {
    pingTimeOut: 600000,
    cors: process.env.FRONTEND_URL,
});


var users = [];

io.on("connection", (socket) => {
    socket.on("userJoined", async (userId) => {
        if (userId) {
            users.push({ socketId: socket.id, userId });

            // Check if this user is already present in db
            const status = await userStatusModel.find({ user: userId });
            if (status.length === 0) {
                // Making user online in db
                await userStatusModel.create({
                    user: userId,
                });
            }

            socket.broadcast.emit("new-user-connected", userId);
        }
    });

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    })

    socket.on("typing", (userId) => {
        // console.log(userId + " is typing");
        socket.broadcast.emit("isTyping", userId);
    });
    socket.on("notTyping", (userId) => {
        socket.broadcast.emit("isNotTyping", userId);
    });

    socket.on("sendMessage", (message) => {
        socket.broadcast.emit("newMessage", message);
    })

    socket.on("disconnect", async () => {
        const user = users.filter((usr) => usr?.socketId === socket.id);
        // console.log("user disconnected", user);
        users = users.filter((usr) => usr?.socketId !== socket.id);

        // Making user offline in db
        await userStatusModel.deleteOne({
            user: user[0]?.userId,
        });

        socket.broadcast.emit("user-disconnected", user[0]?.userId);
    });
})
