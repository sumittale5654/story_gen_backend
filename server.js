// backend/server.js

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const openai = require("openai");
require("dotenv").config(); // Load environment variables from .env file


// Initialize the OpenAI API with your API key
const openaiApiKey = "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";
// Log the API key to the console for verification
const openaiClient = new openai({
  apiKey: "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",
});

// Middleware for parsing JSON requests
app.use(express.json());


// Define your API routes here
// Route for generating a story using OpenAI's GPT-3
app.post("/api/generate-story", async (req, res) => {
  try {
    const { prompt } = req.body;
    // Use the OpenAI API to generate a story
    const response = await openaiClient.completions.create({
      engine: "davinci", 
      prompt: prompt,
      max_tokens: 100, 
    });
    if (response.choices && response.choices.length > 0) {
      const generatedStory = response.choices[0].text;

      // Return the generated story as a response
      res.json({ story: generatedStory });
    } else {
      console.error("Empty or invalid response from OpenAI API:", response);
      res.status(500).json({ error: "An error occurred while generating the story." });
    }
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "An error occurred while generating the story." });
  }
});



// Route for saving a story
//create a array to store saved stories
const savedStories = [];

// Route for saving a story to the in-memory array
app.post("/api/save-story", async (req, res) => {
  try {
    const { story } = req.body;

    //Push the story object into the savedStories array
    savedStories.push(story);

    res.json({ message: "Story saved successfully" });
  } catch (error) {
    console.error("Error saving story:", error);
    res.status(500).json({ error: "An error occurred while saving the story" });
  }
});
// Route to retrieve the list of saved stories (for demonstration purposes)
app.get("/api/saved-stories", (req, res) => {
  try {
    res.json({ stories: savedStories });
  } catch (error) {
    console.error("Error retrieving saved stories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving saved stories." });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
