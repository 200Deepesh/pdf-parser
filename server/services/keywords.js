import keyword_extractor from "keyword-extractor";

export const extractAllKeywordFromText = (text) => {
    try {
        const keyWords = keyword_extractor.extract(text, {
            language: "english",
            remove_digits: true,
            return_changed_case: false,
            remove_duplicates: true,
        });

        return keyWords;
    }
    catch (err) {
        console.error('error in "extractAllKeywordFromText()" function in keywords.js file (server/services/keyword.js): \n', err.message);
        return false;
    }
}

import { retext } from "retext";
import retextKeywords from "retext-keywords";
import retextPos from "retext-pos";
import { toString } from "nlcst-to-string"

export const extractRepeatedKeywordFromText = async (text) => {
    try {
        const file = await retext()
            .use(retextPos)
            .use(retextKeywords, { maximum: text.split(" ").length })
            .process(text);
    
        if (file.data.keywords) {
            const keywords = file.data.keywords.map((keyword) => {
                return toString(keyword.matches[0].node);
            });
            return keywords;
        }
        return [];
    } catch (err) {
        console.error('error in "extractRepeatedKeywordFromText()" function in keywords.js file (server/services/keyword.js): \n', err.message);
        return false;
    }
}

