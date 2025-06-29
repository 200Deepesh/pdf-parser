import keyword_extractor from "keyword-extractor";

export const extractAllKeywordFromText = (text) => {
    const keyWords = keyword_extractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: false,
        remove_duplicates: true,
    });

    return keyWords;
}

import { retext } from "retext";
import retextKeywords from "retext-keywords";
import retextPos from "retext-pos";
import { toString } from "nlcst-to-string"

export const extractRepeatedKeywordFromText = async (text) => {
    const file = await retext()
        .use(retextPos)
        .use(retextKeywords, {maximum: text.split(" ").length})
        .process(text);

    if (file.data.keywords) {
        const keywords = file.data.keywords.map((keyword) => {
            return toString(keyword.matches[0].node);
        });
        return keywords;
    }
    return [];
}

