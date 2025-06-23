import pdf from 'pdf-parse/lib/pdf-parse.js'
import { readFileSync } from "node:fs";

export const pdfToText = async (path) => {
    console.log(path);
    try {
        let textContent;
        const bufferData = readFileSync(path);
        await pdf(bufferData)
            .then((data) => {
                textContent = data.text;
            })
            .catch((err) => {
                console.log(err);
            });
        return textContent;
    } catch (err) {
        console.log("Error in pdfToText function: \n", err.message);
    }
}