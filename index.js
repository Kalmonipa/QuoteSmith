const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN_URL = process.env.DOMAIN_URL || "localhost"
const DATA_DIR = path.join(__dirname, "data");

// Quotes in .txt files should be formatted as following
// Author/Character/Verse etc listed first. A hypen - signifies the end of the author portion and 
// beginning of the quote. The quote does not need to be wrapped in quotes but looks nicer if it is.
// Author - "Quote"
function parseQuote() {

}

async function getRandomLine(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length === 0) {
            throw new Error("File is empty");
        }

        return lines[Math.floor(Math.random() * lines.length)];
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error("File not found");
        }
        throw new Error(`Error reading file: ${err.message}`);
    }
}

app.get("/:filename", async (req, res) => {
    try {
        const { filename } = req.params;

        if (path.extname(filename)) {
            return res.status(400).json({ error: "Path should not contain the file extension" });
        }

        const filePath = path.join(DATA_DIR, `${filename}.txt`);
        const randomLine = await getRandomLine(filePath);

        return res.json({ content: randomLine });
    } catch (error) {        
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("empty")) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error." });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://${DOMAIN_URL}:${PORT}`);
    });
}

module.exports = { app, getRandomLine };

