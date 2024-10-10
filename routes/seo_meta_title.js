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

router.post("/seomtrmo", async (req, res) => {
  const text = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const systemPrompt = `You are Rankmeone ai specialized in generating SEO-friendly meta titles. For any input provided, create a concise meta title between 60-70 characters that is relevant, includes keywords, and is engaging. Respond only with the meta title without any additional text and. If the input contains bad words, inappropriate content, or involves questions about danger, harm, your identity, or any sensitive topics, respond with the code '801'. This response should be used to trigger additional functionality or handling within the system.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${text.text}` },
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      temperature: 0.4,
      top_p: 0.95,
      top_k: 0,
      max_tokens: 20,
      stop: ["\n"], // Stop generation after one line.
      n: 1,
      presence_penalty: 0.5,
      frequency_penalty: 0.5,
      repetition_penalty: 1.2,
    });

    const metaTitle = completion.choices[0].message.content;
    // Calculate the word count of the generated meta title
    const wordCount = metaTitle.split(/\s+/).length;

    res.json({
      output: metaTitle,
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
