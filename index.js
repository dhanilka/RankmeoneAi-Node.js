const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const OpenAI = require("openai");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const seoMetaTitle = require('./routes/seo_meta_title');
const seoMetaDescription = require('./routes/seo_meta_description');
const seoSubKeywords = require('./routes/sub_keyword_generator')
const topicalMap = require('./routes/topical_map')
const blogPostIdeas = require("./routes/blog_post_ideas")
const youtubeTags = require("./routes/youtube_tag_generator")
const youtubeContentIdeas = require("./routes/youtube_content_ideas")
const youtubeHashtags = require("./routes/youtube_hashtag")
const instacaption = require("./routes/instagram_caption")
const twitterCaption = require("./routes/twitter_caption")
const tiktokCaption = require("./routes/tiktok_caption")
const fivertags = require("./routes/fiver_tag")
const midprompt = require("./routes/midjourney_prompt")
const mcqbot = require("./routes/mcq_bot")

app.use('/', seoMetaTitle);
app.use('/', seoMetaDescription);
app.use('/',seoSubKeywords)
app.use('/',topicalMap)
app.use('/', blogPostIdeas)
app.use ('/',youtubeTags)
app.use ('/',youtubeContentIdeas)
app.use ('/',youtubeHashtags)   
app.use ('/',instacaption)
app.use ('/',twitterCaption)
app.use ('/',tiktokCaption)
app.use ('/',fivertags)
app.use ('/',midprompt)
app.use ('/',mcqbot)

app.post('/test', async (req, res) => {
    const  text = req.body;
    console.log(text.text);          
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
