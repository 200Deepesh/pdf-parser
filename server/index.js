import express from "express";
import cors from "cors"

const app = express();
const port = 8000;

app.use(cors());

app.get('/', (req, res) => {
    return res.send('Welcome to pdf parser');
});

app.listen(port, (err) => {
    console.log(`server is listening to port ${port}`);
});
