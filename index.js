// index.js
import dotenv from 'dotenv';
import express from "express"; 
import bodyParser from "body-parser";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fetch from 'node-fetch'; // Assuming you're using node-fetch to fetch the article content

dotenv.config();

const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

async function fetchArticleContent(articleUrl) {
    const response = await fetch(articleUrl);
    return await response.text();
}

app.post("/process-article", async (req, res) => {
    const { articleUrl } = req.body;
    try {
        const articleHtml = await fetchArticleContent(articleUrl);
        const dom = new JSDOM(articleHtml);
        let reader = new Readability(dom.window.document);
        const article = reader.parse();

        // Now, use the extracted content with GPT-4 to further process or summarize it
        const messages = [{
            "role": "system",
            "content": "You are Hi-Lite™, your primary function is to analyze the provided text and extract its essence. From the text inputted, identify and return the most essential sentences, ensuring they are preserved in their original structure and phrasing. The output you produce should contain approximately 25% of the total sentences present in the input. Your objective is to capture the core essence of the text with precision and clarity."
        }, {
            "role": "user",
            "content": article.textContent // Assuming we want to process the textContent of the article
        }];

        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: messages,
        });

        res.json({ content: completion.data.choices[0].message.content });
    } catch (error) {
        console.error("Error processing article:", error);
        res.status(500).json({ error: "Failed to process article" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});