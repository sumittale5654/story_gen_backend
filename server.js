// backend/server.js

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
// const openai = require("openai");
require("dotenv").config();
const openai = require("openai");




const openaiApiKey = process.env.OPENAI_API_KEY;

const openaiClient = new openai({
  apiKey: "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",
});

app.use(cors());
app.use(express.json());


app.post("/generate-story", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openaiClient.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
      temperature : 0,
    });
    res.header("Access-Control-Allow-Origin", "*");

    console.log(response)


    if (response.choices && response.choices.length > 0) {
      const generatedStory = response.choices[0].text;
      res.json({ story: generatedStory });
    } else {
      console.error("Empty or invalid response from OpenAI API:", response);
      res
        .status(500)
        .json({ error: "An error occurred while generating the story." });
    }
  } catch (error) {
    console.error("Error generating story:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the story." });
  }
});

const savedStories = [];



app.post("/api/save-story", async (req, res) => {
  try {
    const { story } = req.body;

   
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
