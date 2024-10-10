const express = require("express");
const router = express.Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

// Middleware setup
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.API_KEY,
});

router.post("/seoskrmo", async (req, res) => {
  const text = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const systemPrompt = `You are Rankmeone ai specialized in generating SEO-friendly sub keywords. For any input provided, create sub keywords should between 5-10 keywords that is relevant, includes search terms, and is engaging. Respond only with the sub keywords without any additional text and. If the input contains bad words, inappropriate content, or involves questions about danger, harm, your identity, or any sensitive topics, respond with the code '801'. This response should be used to trigger additional functionality or handling within the system.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${text.text}` },
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      temperature: 0.5, // Slightly higher to encourage variety in sub-keywords
      top_p: 0.9, // Keep for balanced creativity and relevance
      top_k: 0, // Leave at 0 for flexibility
      max_tokens: 100, // Increased to allow more keyword suggestions
    //   stop: ["\n"],
      n: 1,
      presence_penalty: 0.5, // Increased to discourage repeating the same words
      frequency_penalty: 0.4, // Keep the same to discourage frequent terms
      repetition_penalty: 1.1, // Keep the same to discourage repetitive phrases
    });

    const subKeywords = completion.choices[0].message.content;
    // console.log(subKeywords);
    // Calculate the word count of the generated meta title
    const wordCount = subKeywords.split(/\s+/).length;
    res.json({
      output: subKeywords,
      usage: {
        word_count: wordCount,
      },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
