// Import configuration
import { Configuration, OpenAIApi } from "openai";
// Add web server to access on browser
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Setup configuration
const configuration = new Configuration({
    // Pass in & Set 2 values: organization & API Key values
    organization: "org-D9xpOCM3B26nBReqCNPUkwJW",
    apiKey: "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", //GPT4API_V2.1
})

const openai = new OpenAIApi(configuration); // Initialize configuration

const app = express(); // Initialize express
const port = 3000; // Setup a port being 3000

app.use(bodyParser.json()); // Use bodyParse
app.use(cors()); // Use cors

app.post("/", async (req, res) => { // changed from get request to post request
   
    const { messages } = req.body; // Listen for messages that get sent as part of post request
    
    console.log(messages)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", 
        messages: [
            {"role": "system", "content": "You are Hi-Lite™, an assitant that displays the 5 most essential sentences of a prompt exactly as they were written."},
            ...messages,
            {role: "user", content: `${message}`},
            // Premise 1: all mammals are warm blooded. Premise 2: whales are mammals. Premise 3: therefore whales are warm blooded.
        ]
    })
     
    res.json({ // response as a json object of the completion itself
        completion: completion.data.choices[0]
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
