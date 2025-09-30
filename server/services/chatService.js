const messages = [];
const { getBotReply } = require('./botService');
const { isWebDevQuestion } = require('../utils/keywordUtils');
const { v4: uuidv4 } = require('uuid');

/** Returns the current chat history as an array of messages. */
function getHistory() {
    return messages;
}

/** Adds a user message to the chat history and returns the created message object. */
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


/** Checks if the message requires a bot response, emits typing events, and adds bot message if needed. */
async function addBotMessageIfNeeded(io, text) {
    if (isWebDevQuestion(text)) {
        const DELAY_BEFORE_TYPING = 1500; // wait 1.5s before asking bot
        const MIN_TYPING_TIME = 2000;  // bot typing indicator min 2s

        // wait before showing typing indicator
        await new Promise(res => setTimeout(res, DELAY_BEFORE_TYPING));
        io.emit("userTyping", { userId: "bot", userName: "🤖 AngularBot" });

        const start = Date.now();  // record start time
        const reply = await getBotReply(text); // wait for bot reply

        const elapsed = Date.now() - start; // calculate time passed
        const remainingTime = MIN_TYPING_TIME - elapsed;  // how much more to wait to reach min typing time
        // waiting if minimum time has not passed yet
        if (remainingTime > 0) {
            await new Promise(res => setTimeout(res, remainingTime));
        }

        // Notify clients that bot stopped typing
        io.emit("userStopTyping", { userId: "bot" });

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
