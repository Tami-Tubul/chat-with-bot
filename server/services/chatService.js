const messages = [];
const { getBotReply } = require('./botService');
const { isWebDevQuestion } = require('../utils/keywordUtils');

function getHistory() {
    return messages;
}

function addUserMessage(socketId, userId, userName, text) {
    const msg = {
        id: socketId,
        userId: userId || socketId,
        userName,
        text,
        timestamp: Date.now(),
        type: "user"
    };
    messages.push(msg);
    return msg;
}

async function addBotMessageIfNeeded(io, text) {
    if (isWebDevQuestion(text)) {
        const reply = await getBotReply(text);
        const botMsg = {
            id: "bot-" + Date.now(),
            userId: "bot",
            userName: "🤖 AngularBot",
            text: reply,
            timestamp: Date.now(),
            type: "bot"
        };
        messages.push(botMsg);
        io.emit("newMessage", botMsg);
    }
}

module.exports = { getHistory, addUserMessage, addBotMessageIfNeeded };
