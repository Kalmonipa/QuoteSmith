const fs = require('fs').promises;
const { getRandomLine } = require('../index') ;

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));

describe("getRandomLine", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock calls after each test
    });

    test("returns a random line from a file", async () => {
        const mockData = "Hello\nWorld\nJest\nTesting";
        fs.readFile.mockResolvedValue(mockData);

        const result = await getRandomLine("test.txt");

        expect(["Hello", "World", "Jest", "Testing"]).toContain(result);
        expect(fs.readFile).toHaveBeenCalledWith("test.txt", "utf8");
    });

    test("throws file is empty for an empty file", async () => {
        fs.readFile.mockResolvedValue("");

        expect(getRandomLine("empty.txt")).rejects.toThrow('Error reading file: File is empty');
        expect(fs.readFile).toHaveBeenCalledWith("empty.txt", "utf8");
    });

    test("throws file not found when file read fails", async () => {
        fs.readFile.mockRejectedValue(new Error("File not found"));

        await expect(getRandomLine("nonexistent.txt")).rejects.toThrow('Error reading file: File not found');
        expect(fs.readFile).toHaveBeenCalledWith("nonexistent.txt", "utf8");
    });
});
