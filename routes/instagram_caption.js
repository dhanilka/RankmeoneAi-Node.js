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

router.post("/instacap", async (req, res) => {
  const text = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const systemPrompt = `You are Rankmeone ai specialized in generating SEO-friendly instagram caption. For any input provided, create instagram caption, Respond only with the instagram caption without any additional text or text decoration. If the input contains bad words, inappropriate content, or involves questions about danger, harm, your identity, or any sensitive topics, respond with the code '801'. This response should be used to trigger additional functionality or handling within the system.`;

    const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${text.text}` },
        ],
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct", // Ensure this model is suitable for generating topical maps
        temperature: 0.4, // Lower temperature for more focused and structured results
        top_p: 0.85, // Slightly lower to encourage more relevant sub-keywords
        top_k: 0, // Keep at 0 for flexibility
        max_tokens: 150, // Increased to allow more detailed map generation
        n: 1,
        presence_penalty: 0.6, // Adjusted to further discourage repeating the same terms
        frequency_penalty: 0.5, // Increased to discourage frequent terms
        repetition_penalty: 1.2, // Increased to further discourage repetitive phrases
      });
      

    const topicalMap = completion.choices[0].message.content;
    // console.log(topicalMap);
    // Calculate the word count of the generated meta title
    const wordCount = topicalMap.split(/\s+/).length;
    res.json({
      output: topicalMap,
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
