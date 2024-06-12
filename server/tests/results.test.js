const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

describe.skip("Live Results Page", () => {
    let jwt;

    beforeAll(done => {
        done();
    });

    beforeAll(async () => {
        const response = await request(app).post("/api/users/sign-up").send({
            firstName: "John",
            lastName: "Doe",
            email: "John.Doe@exampleEmail.com",
            categories: ["Mens Doubles", "Mixed Doubles"],
            mobile: "07419795631",
            seeded: false,
            password: "123"
        });
    
        jwt = response.body.token;
    });

    afterAll(done => {
        mongoose.connection.close()
        done()
    });
    
    test("Get categories", async () => {
        const response = await request(app).get("/api/results")
            .set("Authorization", jwt);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("categories");
    });

    test("Get specifc bracket results", async () => {
        const response = await request(app).get(`/api/results/${categoryId}`)
            .set("Authorization", jwt);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("matches");
    });

    // This is a possible page - for the purposes of time it may not be possible, but it could give details about the page:
    test.skip("Get specific match details", async () => {
        const response = await request(app).get(`/api/results/${matchId}`)
            .set("Authorization", jwt);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("match");
    });
});