const request = require("supertest");
const app = require("../index");

describe("GET /:filename", () => {
    test("should return file contents for a valid .txt file", async () => {
        const res = await request(app).get("/sample");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("content");
    });

    test("should return 404 for missing files", async () => {
        const res = await request(app).get("/missing");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "TV Show not found" });
    });
});
