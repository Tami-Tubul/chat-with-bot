require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
    res.json({ message: "Chat API Running..." })
})

const httpServer = createServer(app);

// Socket.io connection
const io = new Server(httpServer, {
    cors: {
        origin: "*", //apply everyone
    },
});


let messages = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send chat history to the newly connected user
    socket.emit("chatHistory", messages);

    // Listen for new messages from clients
    socket.on("sendMessage", (msg) => {
        const message = {
            user: msg.user || "Anonymous",
            text: msg.text,
            timestamp: Date.now(),
        };

        messages.push(message);

        // Broadcast the message to all connected clients
        io.emit("newMessage", message);

        // Bot logic - responds if the message is related to web dev / Angular
        if (/angular|web|frontend/i.test(msg.text)) {
            const botMessage = {
                user: "🤖 AngularBot",
                text: getBotReply(msg.text),
                timestamp: Date.now(),
            };
            messages.push(botMessage);
            io.emit("newMessage", botMessage);
        }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Bot reply function with a unique personality
function getBotReply(question) {
    if (/angular/i.test(question)) {
        return "Angular זה כמו במבה – תמיד טוב להתחיל בקטן, אבל לדעת שיש עוד מלא בפנים 😉";
    }
    if (/react/i.test(question)) {
        return "React? חמוד... אבל Angular זה חבילה מלאה עם DI ו־RxJS 💪";
    }
    if (/web|frontend/i.test(question)) {
        return "פיתוח ווב זה עולם דינמי – תזכור תמיד להפריד לוגיקה לשירותים ולשמור על Clean Code ✨";
    }
    return "שאלה טובה! הייתי בודק את התיעוד הרשמי קודם כל 📚";
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server run in port ${PORT}`))