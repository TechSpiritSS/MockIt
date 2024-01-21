const express = require("express");
const app = express();
const multer = require("multer"); // To handle file uploads
const pdfReader = require("./pdf"); // Import the PDF reading function
const {
  storeChatHistory,
  fetchChatHistory,
  createUser,
  fetchAll,
} = require("./db");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
  
let openai = null;
let pdfContent = "";
let jd = "";
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const upload = multer();

app.post("/update-jd", (req, res) => {
  try {
    const newJD = req.body.text;
    jd = newJD;
    console.log("Updated JD:", jd);
    res.status(200).json({ message: "Job description updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating JD." });
  }
});

// Your existing POST request for handling PDF file upload
app.post("/jobs", upload.single("pdfFile"), async (req, res) => {
  try {
    // job description
    jd = textContent;
    console.log("JD text content:", textContent);
    res.status(200).json({ textContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error reading JD file." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log("Server running on port 8080"));

app.post("/read-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    const pdfFileBuffer = Uint8Array.from(req.file.buffer); // Convert Buffer to Uint8Array
    const textContent = await pdfReader(pdfFileBuffer);
    pdfContent = textContent;
    console.log("PDF text content:", textContent);
    res.status(200).json({ textContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error reading PDF file." });
  }
});

const SYSTEM_PROMPT =
  "You are an interviewer taking an interview based upon the knowledge base provided to you. You need to ask 5 Questions one by one from the user and upon completeing all 5 questions give back the feedback of the Interview to the user. Do not send all 5 questions at once. Send one question at a time. Start with some basic introduction from the user. On getting appropiate answers, proceed to ask question 1 and after recieving the answer, provide the feedback and proceed to ask question 2 and so on. Your feedback should be based upon the answer given by the user. You can ask the same question again if the answer is not appropiate. You can also ask follow up questions based upon the answer given by the user. The knowledge base is as follows: \n\n" +
  pdfContent +
  "\n\n\n\n\n\n\n\n" + jd +
  "Remember to ask the questions one by one and not all at once, wait for the user to answer the question before asking the next one. Make it real and natural.Always wait for the user reply before sending the next question. \n\n\n";

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];
    messages.push({ role: "system", content: SYSTEM_PROMPT });
    // client = OpenAI()
    // const openai = new OpenAI();

    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const botMessage = chat_completion.data.choices[0].message.content;

    console.log(botMessage);

    const responseData = {
      botMessage: botMessage,
    };

    res.send(responseData);
  } catch (error) {
    console.error("Error in /chat endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});




app.post("/get-api-key", (req, res) => {
  try {
    // const { apiKey } = req.body;
    const apiKey  = ""


    if (!apiKey) {
      return res.status(400).json({ error: "API key is required." });
    }

    // Create a new instance of OpenAIApi with the provided API key
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    // Update the existing openai instance with the new configuration
    openai = new OpenAIApi(configuration);

    res.status(200).json({ message: "API key received successfully." });
  } catch (error) {
    console.error("Error in /get-api-key endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/createUser", async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({ error: "Username is required." });
    }
    const result = await createUser(userName);

    if (!result) {
      return res.status(400).json({ error: "Username already exists." });
    }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /createUser endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/store", (req, res) => {
  try {
    const { userId, description, chatHistory } = req.body;

    if (!userId || !description || !chatHistory) {
      return res
        .status(400)
        .json({ error: "userId, description and chatHistory are required." });
    }

    storeChatHistory(userId, description, chatHistory)
      .then((newChatHistory) => {
        res.status(200).json({ message: "Chat history stored successfully." });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error storing chat history." });
      });
  } catch (error) {
    console.error("Error in /store endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/content", (req, res) => {
  try {
    const { userId } = req.body;
    fetchChatHistory(userId)
      .then((chatHistory) => {
        console.log("Chat history retrieved:", chatHistory);
        res.status(200).json({ chatHistory });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error fetching chat history." });
      });
  } catch (error) {
    console.error("Error in /content endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getall", (req, res) => {
  try {
    fetchAll()
      .then((chatHistory) => {
        console.log("Chat history retrieved:", chatHistory);
        res.status(200).json({ chatHistory });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error fetching chat history." });
      });
  } catch (error) {
    console.error("Error in /all endpoint:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
