const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const user = require("../routes/usersRouter");

describe.skip("User matches", () => {
    let userId;
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
        userId = response.body.userId;
    });
    
    afterAll(done => {
        mongoose.connection.close()
        done()
    });

    test("Able to post (update) a specific match result", async () => {
        const response = await request(app).post(`/api/match/${matchId}/update`).send({
            winner: "John Doe", 
            p1Score: ["6", "6"], 
            p2Score: ["2", "4"],
        });
        expect(response.statusCode).toBe(200);
    });
});