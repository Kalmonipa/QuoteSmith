const request = require("supertest");
const { app } = require("../index");

describe("GET /:filename", () => {
    test("should return file contents for a valid .txt file", async () => {
        const res = await request(app).get("/sample");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("content");
    });

    test("should return 404 for missing files", async () => {
        const res = await request(app).get("/missing");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "File not found" });
    });

    test("should return 400 for for a request containing a .txt endpoint", async () => {
        const res = await request(app).get("/sample.txt");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Path should not contain the file extension" });
    });

    test("should return 400 for for a request containing a .json endpoint", async () => {
        const res = await request(app).get("/sample.json");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: "Path should not contain the file extension" });
    });
});
