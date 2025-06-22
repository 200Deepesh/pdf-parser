import express from "express";
import cors from "cors";
import { extractAllKeywordFromText } from "./services/keywords.js";
import { extractRepeatedKeywordFromText } from "./services/keywords.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    return res.send('Welcome to pdf parser');
});

app.post('/all', async (req, res) => {
    const text = req.body.text;
    const keyWords = extractAllKeywordFromText(text);
    return res.json({ keyWords: keyWords });
})

app.post('/repeated', async (req, res) => {
    const text = req.body.text;
    const keyWords = await extractRepeatedKeywordFromText(text);
    return res.json({ keyWords: keyWords });
})

app.listen(port, (err) => {
    console.log(`server is listening to port ${port}`);
});
