const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN_URL = process.env.DOMAIN_URL || "localhost"
const DATA_DIR = path.join(__dirname, "data");

app.get("/:filename", (req, res) => {
    const { filename } = req.params;
    const filenameExt = filename + ".txt";
    const filePath = path.join(DATA_DIR, filenameExt);

    // Check if the file has a .txt extension
    if (path.extname(filename) === ".txt") {
        return res.status(400).json({ error: "Path should not contain the file extension" });
    }

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "TV Show not found" });
        }

        // Read the file contents
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Error reading file" });
            }
            res.json({ content: data });
        });
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://${DOMAIN_URL}:${PORT}`);
    });
}

module.exports = app;
