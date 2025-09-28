require('dotenv').config();
const OpenAI = require("openai");

// Init OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getBotReply(question) {
    try {
        const prompt = `
                You are a witty, hilarious senior Web Developer with world-class Angular expertise. 
                Answer questions in short, funny, clever ways, like chatting with a friend. 
                Use cool emojis 😎🔥💡 to make your answers lively. 
                Only answer what’s asked – no extra advice. 
                Question: "${question}"
            `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150
        });
        return response.choices[0].message.content.trim();

    } catch (err) {
        console.error("OpenAI error:", err);
        return "Hmm… אני קצת מתבלבל כרגע 😅 תנסה שוב!";
    }
}

module.exports = { getBotReply };
