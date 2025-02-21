const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN_URL = process.env.DOMAIN_URL || "localhost";
const EXCLUDE_DEFAULT_FILES = process.env.EXCLUDE_DEFAULT_FILES || false;

// Directories for built-in and user-provided files
const DEFAULT_DATA_DIR = path.join(__dirname, "data");
const USER_DATA_DIR = path.join(__dirname, "user-data");

/////
// Functions
/////

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

async function getCategories() {
    try {
        logMessage("=== Retrieving categories")

        const excludeDefaults = process.env.EXCLUDE_DEFAULT_FILES === "true";
        var categories = [];
        const userFiles = await fs.readdir(USER_DATA_DIR).catch(() => []);

        if (excludeDefaults === true) {
            categories = [...new Set(userFiles)];
        } else {
            const defaultFiles = await fs.readdir(DEFAULT_DATA_DIR);
            categories = [...new Set([...defaultFiles, ...userFiles])]
        }

        categories = categories.filter(file => {
                if (file.endsWith(".txt")) {
                    logMessage("    " + file)
                    return true;
                } else return false
            })
            .map(file => path.basename(file, ".txt"))
            .sort();

        return categories;
    } catch (err) {
        console.error("Error reading categories:", err);
        return [];
    }
}

async function getRandomLine(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== "");

        if (lines.length === 0) {
            throw new Error("File is empty");
        }

        return lines[Math.floor(Math.random() * lines.length)];
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("File not found");
        }
        throw new Error(`Error reading file: ${error.message}`);
    }
}

// Logger function to format logs
function logMessage(message) {
    const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();
    
    const timestamp = `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  
    //const timestamp = new Date().toUTCString();
    console.log(`[${timestamp}] - ${message}`);
}

// Quotes in .txt files should be formatted as following
// Author/Character/Verse etc listed first. A hyphen - signifies the end of the author portion and 
// beginning of the quote. The quote does not need to be wrapped in quotes but looks nicer if it is.
// Author - "Quote"
// This function returns an array containing the author and the quote.
function parse(quote) {
    const strArray = quote.split(/-(.*)/s);

    const strArrayWithoutEmpty = strArray.filter(function (letter) {
        return letter !== '';
    });
    
    const trimmedArray = strArrayWithoutEmpty.map(item => item.trim());

    if (trimmedArray.length !== 2) {
        throw new Error("Invalid quote format: " + quote);
    }

    return trimmedArray;
}

/////
// Endpoints
/////

app.get("/quotes/:filename", async (req, res) => {
    try {
        const { filename } = req.params;

        if (path.extname(filename)) {
            return res.status(400).json({ error: "Path should not contain the file extension" });
        }

        logMessage("Retrieving from " + filename)

        const filePath = await findFile(filename);
        const randomLine = await getRandomLine(filePath);
        const parsedLine = parse(randomLine);
        const responseData = { author: parsedLine[0], quote: parsedLine[1] };

        logMessage(`Retrieved JSON: ${JSON.stringify(responseData)}`);
        return res.json(responseData);
    } catch (error) {  
        logMessage(error.message) 
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("empty")) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error.", message: error.message });
    }
});

app.get("/categories", async (req, res) => {
    const categories = await getCategories();
    res.json({ categories });
});


app.use(express.static(path.join(__dirname, "frontend")));

if (require.main === module) {
    app.listen(PORT, () => {
        logMessage(`Server running on port ${PORT}`);
    });
}

module.exports = { app, getRandomLine, findFile, getCategories, parse };
