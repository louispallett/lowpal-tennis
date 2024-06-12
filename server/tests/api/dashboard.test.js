const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const User = require("../../models/user");

describe("Dashboard Page", () => {
    let jwt;
    let userId;
    
    beforeAll(done => {
        done();
    });
    
    beforeAll(async () => {
        await request(app).post("/users/sign-up").send({
            firstName: "John",
            lastName: "Doe",
            email: "John.Doe@exampleEmail.com",
            gender: "male",
            categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
            mobile: "07419795631",
            seeded: false,
            password: "123"
        });

        const response = await request(app).post("/users/sign-in").send({
            email: "John.Doe@exampleEmail.com",
            password: "123"
        });
    
        jwt = response.body.token;
        userId = response.body.userId;
    });

    afterAll(async () => {
        await User.deleteMany({});
    });
    
    afterAll(done => {
        mongoose.connection.close()
        done()
    });

    describe("Authorization for dashboard page", () => {
        test("Returns 200 if user is authorized", async () => {
            const response = await request(app).get(`/dashboard/${userId}`)
                .set("Authorization", jwt);
            expect(response.statusCode).toBe(200);
        });

        test("Returns 403 if user is NOT authorized (no header)", async () => {
            const response = await request(app).get(`/dashboard/${userId}`);
            expect(response.statusCode).toBe(403);
        });

        test("Returns 403 if user is NOT authorized (fake header)", async () => {
            const response = await request(app).get(`/dashboard/${userId}`)
                .set("Authorization", "eyJhbGciOiEIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2NWJjYTM5NzA2NWY2MzcwNGRjYjlkNSIsInVzZXJuYW1lIjoibG91aXNwYWxsZXR0IiwiZW1haWwiOiJsb3Vpcy5wYWxsZXR0QG91dGxvb2suY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkcmVxMTQ3cWJjOS9lQVdBTFg0djBoLlNZazJ1TXRsRFVLT1BQaWRyL2d6MEFyemNzNDE4SzYiLCJfX3YlOjB9LCJpYXQiOjE3MTgxMDA5NaQsImV4cCI6MTcxODk2NDk3NH0.qlCp4bc_iCH0xmFK6-vZBnFe0uVHulazCo4fC3NSEJ1");
            expect(response.statusCode).toBe(403);
        });
    });

    describe("Able to get user categories", () => {
        test("Returns correct categories", async () => {
            const response = await request(app)
                .get(`/dashboard/${userId}`)
                .set("Authorization", jwt)
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toHaveProperty("categories", ["Mens Doubles", "Mixed Doubles"]);
        });
    });
});