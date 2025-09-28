const messages = [];
const { getBotReply } = require('./botService');
const { isWebDevQuestion } = require('../utils/keywordUtils');
const { v4: uuidv4 } = require('uuid');

function getHistory() {
    return messages;
}

function addUserMessage(socketId, userId, userName, text) {
    const msg = {
        id: uuidv4(),
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
            id: uuidv4(),
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
