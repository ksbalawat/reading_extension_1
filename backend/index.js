// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { PrismaClient } = require("@prisma/client");
// const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

// const app = express();
// const prisma = new PrismaClient();
// const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
// const openai = new OpenAIApi(configuration);

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/api/context", async (req, res) => {
//   const { selectedText } = req.body;
//   if (!selectedText) return res.status(400).json({ error: "Text is required" });

//   try {
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `Explain the contextual meaning of the following text:\n"${selectedText}"`,
//       max_tokens: 150,
//     });

//     const explanation = response.data.choices[0].text.trim();
//     const newContext = await prisma.context.create({
//       data: { selectedText, explanation },
//     });

//     res.json(newContext);
//   } catch (error) {
//     console.error("Error processing AI:", error);
//     res.status(500).json({ error: "AI processing failed" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { PrismaClient } = require("@prisma/client");
// const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

// const app = express();
// const prisma = new PrismaClient();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/test-openai', async (req, res) => {
//   try {
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: "Explain 'Artificial Intelligence' in simple terms.",
//       max_tokens: 50,
//     });

//     res.json({ result: response.data.choices[0].text.trim() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error communicating with OpenAI");
//   }
// });

// app.post("/api/context", async (req, res) => {
//   const { selectedText } = req.body;
//   if (!selectedText) return res.status(400).json({ error: "Text is required" });

//   try {
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `Explain the contextual meaning of the following text:\n"${selectedText}"`,
//       max_tokens: 150,
//     });

//     const explanation = response.data.choices[0].text.trim();
//     const newContext = await prisma.context.create({
//       data: { selectedText, explanation },
//     });

//     res.json(newContext);
//   } catch (error) {
//     console.error("Error processing AI:", error);
//     res.status(500).json({ error: "AI processing failed" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { OpenAI } = require("openai"); // Import OpenAI directly
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

// Initialize OpenAI API client directly with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());


//routing 

app.get('/', (req, res) => {
    res.send('Welcome to the AI Web Extension Backend');
  });
  
  



// API endpoint for getting context
app.post("/api/context", async (req, res) => {
  const { selectedText } = req.body;
  if (!selectedText) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Explain the contextual meaning of the following text:\n"${selectedText}"` }],
    });

    const explanation = response.choices[0].message.content.trim();
    const newContext = await prisma.context.create({
      data: { selectedText, explanation },
    });

    res.json(newContext);
  } catch (error) {
    console.error("Error processing AI:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// Test endpoint to check OpenAI
app.post('/api/test-openai', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Explain 'Artificial Intelligence' in simple terms." }],
    });

    res.json({ result: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

