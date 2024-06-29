const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: '/tmp/' });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const summary = await getChatGPTSummary(fileContent);

  res.json({ summary });
});

const getChatGPTSummary = async (text) => {
  const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    prompt: `Summarize the following text:\n\n${text}`,
    max_tokens: 150,
    temperature: 0.5
  }, {
    headers: {
      'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].text.trim();
};

module.exports = app;
