import pdf from 'pdf-parse/lib/pdf-parse.js'
import { readFileSync } from "node:fs";

export const pdfToText = async (path) => {
    try {
        let textContent;
        const bufferData = readFileSync(path);
        await pdf(bufferData)
            .then((data) => {
                textContent = data.text;
            })
            .catch((err) => {
                console.error('error in "pdf()" function of "pdf-parse" in file.js file (server/services/file.js): \n', err.message);
            });

        return textContent;
    } catch (err) {
        console.error('Error in "pdfToText()" function in file.js file (server/services/file.js): \n', err.message);
        return false;
    }
}