const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const user = require("../../routes/usersRouter");

describe.skip("Matches", () => {
    let userId;
    let jwt;
    
    beforeAll(done => {
        done();
    });
    
    afterAll(done => {
        mongoose.connection.close()
        done()
    });

    describe("User CRUD operations", () => {
        test("Able to get specific match", () => {
            request(app)
                .get(`${categoryId}/match/${matchId}`)
                .set("Authorization", jwt)
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    
        test.skip("Able to post (update) a specific match result", async () => {
            const response = await request(app).post(`${categoryId}/match/${matchId}/update`)
                .set("Authorization", jwt)
                .send({
                    winner: "John Doe", 
                    p1Score: ["6", "6"], 
                    p2Score: ["2", "4"],
                });
            expect(response.statusCode).toBe(200);
        });
    })
});