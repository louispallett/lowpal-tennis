const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const categoryId = "666603b22330d16c5cb657de"; // This is for men's singles

describe.skip("Live Results Page", () => {
    let jwt;

    beforeAll(done => {
        done();
    });

    beforeAll(async () => {
        const response = await request(app).post("/users/sign-up").send({
            firstName: "John",
            lastName: "Doe",
            email: "John.Doe@exampleEmail.com",
            categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
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
    
    // test("Get categories", async () => {
    //     const response = await request(app).get("/results")
    //         .set("Authorization", jwt);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
    //     expect(response.body).toHaveProperty("categories");
    // });

    test("Get specifc bracket results", async () => {
        const response = await request(app).get(`/results/${categoryId}`)
            .set("Authorization", jwt);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("matches");
    });

    // This is a possible page - for the purposes of time it may not be possible, but it could give details about the page:
    test.skip("Get specific match details", async () => {
        const response = await request(app).get(`/results/${matchId}`)
            .set("Authorization", jwt);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("match");
    });
});