import express from "express";
import cors from "cors";
import multer from "multer";
import { extractAllKeywordFromText } from "./services/keywords.js";
import { pdfToText } from "./services/file.js";
import { unlinkSync } from "fs";

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());
app.use(express.urlencoded());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploads = multer({ storage: storage });

app.get('/', async (req, res) => {
    return res.render('home');
});

app.post('/', uploads.single('file'), async (req, res) => {
    if (req.file) {
        const path = `./uploads/${req.file.filename}`;
        const text = await pdfToText(path);
        const keyWords = extractAllKeywordFromText(text);
        unlinkSync(path);
        return res.render('home', { keywords: keyWords });
    }
});

app.listen(port, (err) => {
    console.log(`server is listening to port ${port}`);
});
