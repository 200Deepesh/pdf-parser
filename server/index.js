import express from "express";
import cors from "cors";
import multer from "multer";
import { extractAllKeywordFromText, extractRepeatedKeywordFromText } from "./services/keywords.js";
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
        console.log(file);
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const uploads = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.originalname.endsWith('.pdf')) {
            return cb(null, true);
        }
        else {
            return cb( new Error('invalid file extention, expecting pdf files only'));
        }
    }
}).single('file');

app.get('/', async (req, res) => {
    return res.render('home');
});

app.post('/', (req, res, next) => {
    uploads(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('error from "multer" in index.js file (/server/index.js):\n', err.message);
            return res.status(500).send('got error in multer while save the file');
        } else if (err) {
            console.error('error while saving the input file in index.js file (/server/index.js):\n', err.message);
            return res.status(400).send(err.message);
        }
        return next();
    })
}, async (req, res) => {
    if (req.file) {
        const path = `./uploads/${req.file.filename}`;
        const text = await pdfToText(path);
        if (!text) {
            unlinkSync(path);
            return res.status(500).send('server is unable to extract text content from the file');
        }
        const keyWords = await extractAllKeywordFromText(text);
        if(!keyWords) {
            unlinkSync(path);
            return res.status(500).send('server is unable to extract keywords from the text content of the file');
        }
        unlinkSync(path);
        return res.render('home', { keywords: keyWords });
    }
    else {
        return res.status(400).send('file is missing in request object\nreq.file:', req.file);
    }
});

app.listen(port, (err) => {
    console.log(`server is listening to port ${port}`);
});
