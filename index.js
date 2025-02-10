const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN_URL = process.env.DOMAIN_URL || "localhost";

// Directories for built-in and user-provided files
const DEFAULT_DATA_DIR = path.join(__dirname, "data");
const USER_DATA_DIR = path.join(__dirname, "user-data");

// Quotes in .txt files should be formatted as following
// Author/Character/Verse etc listed first. A hyphen - signifies the end of the author portion and 
// beginning of the quote. The quote does not need to be wrapped in quotes but looks nicer if it is.
// Author - "Quote"
// This function returns an array containing the author and the quote.
function parse(quote) {
    const strArray = quote.split("-");
    const trimmedArray = strArray.map(item => item.trim());

    if (strArray.length !== 2) {
        throw new Error("Invalid quote format");
    }

    return trimmedArray;
}

async function getRandomLine(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== "");

        if (lines.length === 0) {
            throw new Error("File is empty");
        }

        return lines[Math.floor(Math.random() * lines.length)];
    } catch (err) {
        if (err.code === "ENOENT") {
            throw new Error("File not found");
        }
        throw new Error(`Error reading file: ${err.message}`);
    }
}

async function findFile(filename) {
    const userFilePath = path.join(USER_DATA_DIR, `${filename}.txt`);
    const defaultFilePath = path.join(DEFAULT_DATA_DIR, `${filename}.txt`);

    try {
        await fs.access(userFilePath);
        return userFilePath;
    } catch (err) {}

    try {
        await fs.access(defaultFilePath);
        return defaultFilePath;
    } catch (err) {}

    throw new Error("Error reading file: File not found");
}


app.get("/:filename", async (req, res) => {
    try {
        const { filename } = req.params;

        if (path.extname(filename)) {
            return res.status(400).json({ error: "Path should not contain the file extension" });
        }

        const filePath = await findFile(filename);
        const randomLine = await getRandomLine(filePath);
        const parsedLine = parse(randomLine);

        return res.json({ author: parsedLine[0], quote: parsedLine[1] });
    } catch (error) {   
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("empty")) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error.", message: error.message });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://${DOMAIN_URL}:${PORT}`);
    });
}

module.exports = { app, getRandomLine, findFile };
