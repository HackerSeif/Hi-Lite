// Import dotenv to use environment variables
import dotenv from 'dotenv';
dotenv.config(); // This loads the environment variables from the .env file

// Import configuration and OpenAI API
import { Configuration, OpenAIApi } from "openai";

// Add web server to access on browser
import express from "express"; 
import bodyParser from "body-parser";
import cors from "cors";

// Setup configuration using environment variables
const configuration = new Configuration({
    organization: process.env.ORGANIZATION, // Use organization from .env
    apiKey: process.env.API_KEY, // Use API_KEY from .env
});

const openai = new OpenAIApi(configuration); // Initialize configuration
const app = express(); // Initialize express
const port = 3000; // Setup a port being 3000

app.use(bodyParser.json()); // Use bodyParser
app.use(cors()); // Use cors

app.post("/", async (req, res) => {
    const { messages } = req.body; // Listen for messages that get sent as part of post request

    console.log(messages)
    const completion = await openai.createChatCompletion({
        model: "gpt-4-0125-preview",
        messages: [
            {"role": "system", "content": "You are Hi-Lite™, your primary function is to analyze the provided text and extract its essence. From the text inputted, identify and return the most essential sentences, ensuring they are preserved in their original structure and phrasing. The output you produce should contain approximately 25% of the total sentences present in the input. Your objective is to capture the core essence of the text with precision and clarity, without changing the wording or lettering."},
            ...messages,
            // Example premises could go here
        ]
    });
     
    res.json({ // response as a json object of the completion itself
        completion: completion.data.choices[0]
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
