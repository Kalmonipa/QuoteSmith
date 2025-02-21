const fs = require('fs').promises;
const path = require('path');
const { getRandomLine, getCategories, parse } = require('../index');

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        readdir: jest.fn()
    }
}));

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
});

const DEFAULT_DATA_DIR = path.resolve("data");
const USER_DATA_DIR = path.resolve("user-data");

// ToDo: Add tests for parse function

describe("getRandomLine", () => {
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

describe("parseLines", () => {
    test("should parse the line and return an array", async () => {
        const mockedLine = "Plato - The right question is usually more important than the right answer"

        const parsedLine = parse(mockedLine)

        expect(parsedLine[0]).toEqual("Plato")
        expect(parsedLine[1]).toEqual("The right question is usually more important than the right answer")
    })
    test("should parse the line with multiple hyphens and return an array", async () => {
        const mockedLine = "Marcus Aurelius - Do not be wise in words - be wise in deeds."

        const parsedLine = parse(mockedLine)

        expect(parsedLine[0]).toEqual("Marcus Aurelius")
        expect(parsedLine[1]).toEqual("Do not be wise in words - be wise in deeds.")
    })
    test("should fail to parse missing author", async () => {
        const mockedLine = "- This should fail"

        expect(() => parse(mockedLine)).toThrow("Invalid quote format: - This should fail")
    })
    test("should fail to parse missing quote", async () => {
        const mockedLine = "This should fail -"

        expect(() => parse(mockedLine)).toThrow("Invalid quote format: This should fail -")
    })
})

describe("getCategories", () => {
    test("returns sorted and deduplicated list of categories from both directories", async () => {    
        fs.readdir.mockImplementation(async (dir) => {
            if (dir === DEFAULT_DATA_DIR) return ["a.txt", "b.txt", "c.txt"];
            if (dir === USER_DATA_DIR) return ["b.txt", "d.txt"];
            return [];
        });
    
        const result = await getCategories();
        expect(result).toEqual(["a", "b", "c", "d"]);
    });

    test("returns sorted and deduplicated list of categories from both unorganised directories", async () => {    
        fs.readdir.mockImplementation(async (dir) => {
            if (dir === DEFAULT_DATA_DIR) return ["o.txt", "m.txt", "l.txt"];
            if (dir === USER_DATA_DIR) return ["z.txt", "a.txt"];
            return [];
        });
    
        const result = await getCategories();
        expect(result).toEqual(["a", "l", "m", "o", "z"]);
    });

    test("handles missing USER_DATA_DIR gracefully", async () => {
        fs.readdir.mockImplementation(async (dir) => {
            if (dir === DEFAULT_DATA_DIR) return ["x.txt", "y.txt"];
            if (dir === USER_DATA_DIR) throw new Error("Directory not found");
            return [];
        });

        const result = await getCategories();
        expect(result).toEqual(["x", "y"]);
    });

    test("handles excluding default files", async () => {  
        process.env.EXCLUDE_DEFAULT_FILES = "true";

        fs.readdir.mockImplementation(async (dir) => {
            if (dir === DEFAULT_DATA_DIR) return ["a.txt", "b.txt", "c.txt"];
            if (dir === USER_DATA_DIR) return ["b.txt", "d.txt"];
            return [];
        });
    
        const result = await getCategories();
        expect(result).toEqual(["b", "d"]);

        delete process.env.EXCLUDE_DEFAULT_FILES;
    });

    test("ignores non-txt files", async () => {
        fs.readdir.mockImplementation(async (dir) => {
            if (dir.includes(DEFAULT_DATA_DIR)) return ["valid.txt", "image.png", "note.md"];
            if (dir.includes(USER_DATA_DIR)) return ["another.txt", "script.js"];
            return [];
        });

        const result = await getCategories();
        expect(result).toEqual(["another", "valid"]);
    });

    test("returns an empty array when both directories are empty", async () => {
        fs.readdir.mockResolvedValue([]);

        const result = await getCategories();
        expect(result).toEqual([]);
    });

    test("returns an empty array when an unexpected error occurs", async () => {
        const errorMessage = "Unexpected error";
        fs.readdir.mockRejectedValue(new Error(errorMessage));
    
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
        const result = await getCategories();
    
        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Error reading categories:"), expect.any(Error));
    
        consoleErrorSpy.mockRestore();
    });
});
