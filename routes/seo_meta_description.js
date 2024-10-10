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

router.post("/seomdrmo", async (req, res) => {
  const text = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const systemPrompt = `You are Rankmeone ai specialized in generating SEO-friendly meta descriptions. For any input provided, create a concise meta description should between 150-160 characters that is relevant, includes keywords, and is engaging. Respond only with the meta description without any additional text and. If the input contains bad words, inappropriate content, or involves questions about danger, harm, your identity, or any sensitive topics, respond with the code '801'. This response should be used to trigger additional functionality or handling within the system.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${text.text}` },
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      temperature: 0.3, // Lower temperature for more focused output
      top_p: 0.9, // Slightly reduced to limit unexpected phrases
      top_k: 0,
      max_tokens: 40, // Allow more tokens to complete a concise meta description
      stop: ["\n"],
      n: 1,
      presence_penalty: 0.3, // Adjusted to slightly discourage repetition
      frequency_penalty: 0.4,
      repetition_penalty: 1.1,
    });

    const metDesc = completion.choices[0].message.content;
    // console.log(metDesc);
    // Calculate the word count of the generated meta title
    const wordCount = metDesc.split(/\s+/).length;

    res.json({
      output: metDesc,
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
