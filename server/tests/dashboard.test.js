const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

describe.skip("Dashboard Page", () => {
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

    describe("Authorization for dashboard page", () => {
        test("Returns 200 if user is authorized", async () => {
            const response = await request(app).get(`/api/${userId}/dashboard`)
                .set("Authorization", jwt);
            expect(response.statusCode).toBe(200);
        });

        test("Returns 403 if user is NOT authorized (no header)", async () => {
            const response = await request(app).get(`/api/${userId}/dashboard`);
            expect(response.statusCode).toBe(403);
        });

        test("Returns 403 if user is NOT authorized (fake header)", async () => {
            const response = await request(app).get(`/api/${userId}/dashboard`)
                .set("Authorization", "eyJhbGciOiEIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2NWJjYTM5NzA2NWY2MzcwNGRjYjlkNSIsInVzZXJuYW1lIjoibG91aXNwYWxsZXR0IiwiZW1haWwiOiJsb3Vpcy5wYWxsZXR0QG91dGxvb2suY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkcmVxMTQ3cWJjOS9lQVdBTFg0djBoLlNZazJ1TXRsRFVLT1BQaWRyL2d6MEFyemNzNDE4SzYiLCJfX3YlOjB9LCJpYXQiOjE3MTgxMDA5NaQsImV4cCI6MTcxODk2NDk3NH0.qlCp4bc_iCH0xmFK6-vZBnFe0uVHulazCo4fC3NSEJ1");
            expect(response.statusCode).toBe(403);
        });
    });

    describe("Able to get user matches", () => {
        test("Returns correct categories", () => {
            request(app)
                .get(`/api/${userId}/dashboard`)
                .set("Authorization", jwt)
                .expect("Content-Type", /json/)
                .expect({ categories: ["Mens Singles", "Mixed Doubles"] });
        });

        test("Able to get specific match", () => {
            request(app)
                .get(`/api/match/${matchId}`)
                .set("Authorization", jwt)
                .expect("Content-Type", /json/)
                .expect({ match: { userMatch } }); // We'll have to define userMatch at the top of the programme
        });
    });
});