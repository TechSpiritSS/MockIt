const express = require('express');
const app = express();
const multer = require('multer'); // To handle file uploads
const pdfReader = require('./pdf'); // Import the PDF reading function
const {
  storeChatHistory,
  fetchChatHistory,
  createUser,
  fetchAll,
} = require('./db');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

let openai = null;
let pdfContent = '';
let jd = '';
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
const upload = multer();

app.post('/update-jd', (req, res) => {
  try {
    const { jobdesc } = req.body;
    jd = jobdesc;
    console.log('Updated JD:', jd);
    res.status(200).json({ message: 'Job description updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating JD.' });
  }
});

// // Your existing POST request for handling PDF file upload
// app.post('/jobs',  async (req, res) => {
//   try {
//     // job description
//     const {jd} = req.body
//     const jdString = JSON.stringify(jd)

//     // add JD

// });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log('Server running on port 8080'));

app.post('/read-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfFileBuffer = Uint8Array.from(req.file.buffer); // Convert Buffer to Uint8Array
    const textContent = await pdfReader(pdfFileBuffer);
    pdfContent = textContent;
    console.log('PDF text content:', textContent);
    res.status(200).json({ textContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error reading PDF file.' });
  }
});

const SYSTEM_PROMPT = `
You are an AI interviewer taking an interview based upon the resume and job description we provided to you. You need to ask 5 questions one by one to the user. Start by a small gesture and ask the technical questions based on (resume and job description) . Remember to ask the questions one by one and not all at once. Wait for the user to answer the question before asking the next one. First ask question 1 then wait for the user to answer then ask question 2 and so on . The question should be in increasing number do not repeat questions or question numbers.


and the Job description is as follows:
${jd}

 Make it real and natural. Upon completing all the questions, give back feedback of the interview to the user.
`;

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    messages.push({ role: 'system', content: SYSTEM_PROMPT });
    // client = OpenAI()
    // const openai = new OpenAI();

    const chat_completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const botMessage = chat_completion.data.choices[0].message.content;

    console.log(botMessage);

    const responseData = {
      botMessage: botMessage,
    };

    res.send(responseData);
  } catch (error) {
    console.error('Error in /chat endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-api-key', (req, res) => {
  try {
    const { apiKey } = req.body;
    // const apiKey  = ""

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required.' });
    }

    // Create a new instance of OpenAIApi with the provided API key
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    // Update the existing openai instance with the new configuration
    openai = new OpenAIApi(configuration);

    res.status(200).json({ message: 'API key received successfully.' });
  } catch (error) {
    console.error('Error in /get-api-key endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createUser', async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    const result = await createUser(userName);

    if (!result) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in /createUser endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/store', (req, res) => {
  try {
    const { userId, description, chatHistory } = req.body;

    if (!userId || !description || !chatHistory) {
      return res
        .status(400)
        .json({ error: 'userId, description and chatHistory are required.' });
    }

    storeChatHistory(userId, description, chatHistory)
      .then((newChatHistory) => {
        res.status(200).json({ message: 'Chat history stored successfully.' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Error storing chat history.' });
      });
  } catch (error) {
    console.error('Error in /store endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/content', (req, res) => {
  try {
    const { userId } = req.body;
    fetchChatHistory(userId)
      .then((chatHistory) => {
        console.log('Chat history retrieved:', chatHistory);
        res.status(200).json({ chatHistory });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Error fetching chat history.' });
      });
  } catch (error) {
    console.error('Error in /content endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getall', (req, res) => {
  try {
    fetchAll()
      .then((chatHistory) => {
        console.log('Chat history retrieved:', chatHistory);
        res.status(200).json({ chatHistory });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Error fetching chat history.' });
      });
  } catch (error) {
    console.error('Error in /all endpoint:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
