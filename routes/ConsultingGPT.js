const express = require('express');
const router = express.Router();
const Consulting = require('../models/ConsultGPT');
const User = require('../models/User');
const { Configuration, OpenAIApi } = require("openai");
const config = require('../config');

const configuration = new Configuration({
  apiKey: config.API_KEY,
});
const openai = new OpenAIApi(configuration);

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Get the consulting form page
router.get('/consulting', isLoggedIn, async (req, res, next) => {
  res.render('consultingForm');
});

// Display previous consulting entries for the user
router.get('/consulting/history', isLoggedIn, async (req, res, next) => {
  const userId = req.user._id;
  const consults = await Consulting.find({ userId }).sort({ createdAt: -1 });
  res.render('consultingHistory', { consults });
});

// Render the consulting result page
router.post('/consultingResult', isLoggedIn, async (req, res, next) => {
    const { mood, specialThings } = req.body;
  
    const response = await generateResponse(mood, specialThings);
  
    // Save the consulting entry to the database
    const consulting = new Consulting({
      mood,
      specialThings,
      createdAt: new Date(),
      response,
      userId: req.user._id,
    });
    await consulting.save();
  
    console.log(response); 
    res.render('consultingResult', { consulting });
  });
  

async function generateResponse(mood, specialThings) {
    const prompt = `Mood: ${mood}\nSpecial things: ${specialThings}\nResponse:`;
    const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `My mood today is ${mood} and I experienced ${specialThings} today. Please behave like an consulter and provide me some suggestions to help me to live a better life!`,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
    const response = result.data.choices[0].text.trim();
    return response;
  }
  
  
module.exports = router;

