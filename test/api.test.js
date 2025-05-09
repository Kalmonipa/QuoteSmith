const fs = require('fs').promises;
const request = require("supertest");
const { app } = require("../index");

// Mocking fs.readFile
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe("GET /:filename", () => {
    test("should return file contents for a valid .txt file", async () => {
        // ToDo: The next few lines are repeated for a few tests. Tidy them up to DRY
        const mockFileContent = "John Doe - Test quote";

        fs.access = jest.fn().mockResolvedValue(undefined);
        
        fs.readFile = jest.fn().mockResolvedValue(mockFileContent);
    
        const res = await request(app).get("/quotes/sample");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("quote");
        expect(res.body.author).toBe("John Doe");
        expect(res.body.quote).toBe("Test quote");
    });

    test("should return file contents for a single quoted .txt file", async () => {
        const mockFileContent = "John Doe - 'Test quote'";

        fs.access = jest.fn().mockResolvedValue(undefined);
        
        fs.readFile = jest.fn().mockResolvedValue(mockFileContent);
    
        const res = await request(app).get("/quotes/sample");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("quote");
        expect(res.body.author).toBe("John Doe");
        expect(res.body.quote).toBe("'Test quote'");
    });

    test("should return file contents for a double quoted .txt file", async () => {
        const mockFileContent = "John Doe - \"Test quote\"";

        fs.access = jest.fn().mockResolvedValue(undefined);
        
        fs.readFile = jest.fn().mockResolvedValue(mockFileContent);
    
        const res = await request(app).get("/quotes/sample");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("quote");
        expect(res.body.author).toBe("John Doe");
        expect(res.body.quote).toBe("\"Test quote\"");
    });

    test("should throw an error for an invalid .txt file", async () => {
        const mockFileContent = "John Doe . Test quote";
    
        fs.access = jest.fn().mockResolvedValue(undefined);
        
        fs.readFile = jest.fn().mockResolvedValue(mockFileContent);
    
        const res = await request(app).get("/quotes/sample");
    
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Invalid quote format: " + mockFileContent);
        expect(res.body).not.toHaveProperty("author");
        expect(res.body).not.toHaveProperty("quote");
    });

    test("should throw an error for an invalid .txt file", async () => {
        const mockFileContent = "John Doe = Test quote";

        fs.readFile.mockResolvedValue(mockFileContent);

        const res = await request(app).get("/quotes/sample");

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Invalid quote format: " + mockFileContent)
        expect(res.body).not.toHaveProperty("author");
        expect(res.body).not.toHaveProperty("quote");
    });

    test("should return 404 for missing files", async () => {
        fs.readFile.mockRejectedValue(new Error("File not found"));

        const res = await request(app).get("/quotes/missing");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Error reading file: File not found" });
    });

    test("should return 400 for a request containing a .txt endpoint", async () => {
        const res = await request(app).get("/quotes/sample.txt");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Path should not contain the file extension" });
    });

    test("should return 400 for a request containing a .json endpoint", async () => {
        const res = await request(app).get("/quotes/sample.json");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Path should not contain the file extension" });
    });
});
