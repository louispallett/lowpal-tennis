const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../models/user");
const app = require("../../app");

beforeAll(done => {
    done();
});

afterAll(done => {
    mongoose.connection.close();
    done();
});

describe("User sign-up: /users/sign-up", () => {

    afterEach(async () => {
        await User.deleteMany({});
    });
    
    describe("User attempts to sign up correctly", () => {
        test("Should respond with a 200 status code", async () => {
            const response = await request(app).post("/users/sign-up").send({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@exampleEmail.com",
                gender: "male",
                categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
                mobile: "07419795631",
                seeded: false,
                password: "123"
            });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("Form submitted with validation errors", () => {
        test("Should respond with JSON if there are validation errors", async () => {
            const response = await request(app).post("/users/sign-up").send({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@exampleEmail",
                gender: "male",
                categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
                mobile: "07419795631",
                seeded: false,
                password: "123"
            })
            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toHaveProperty("message", "Validation Failed");
            expect(response.body).toHaveProperty("errors");
            expect(Array.isArray(response.body.errors)).toBe(true);
        }); 

        test("Should respond with validation errors (invalid mobile number)", async () => {
            const response = await request(app).post("/users/sign-up").send({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@exampleEmail.com",
                gender: "male",
                categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
                mobile: "75761203dd7",
                seeded: false,
                password: "123"
            })
            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toHaveProperty("message", "Validation Failed");
            expect(response.body).toHaveProperty("errors");
            expect(Array.isArray(response.body.errors)).toBe(true);
        });
    });

    // Not working - information is fine and is returning 200 and sending through sign up - this is a backend issue so we need to make sure
    // if any information is missing we respond appropriately.
    describe("Basic information missing", () => {
        test("Should respond with validation errors", async () => {
            const response = await request(app).post("/users/sign-up").send({
                firstName: "John",
                lastName: "Doe",
                gender: "male",
                categories: ["666b147c381eca0da3b657e0", "666b147c381eca0da3b657e2"],
                mobile: "07419795631",
                seeded: false,
                password: "123"
            });
            expect(response.statusCode).toBe(400);
            // expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            // expect(response.body).toHaveProperty("message", "Validation Failed");
            // expect(response.body).toHaveProperty("errors");
            // expect(Array.isArray(response.body.errors)).toBe(true);
        });
    });
});

describe("User sign-in: /users/sign-in", () => {

    afterAll(async () => {
        await User.deleteMany({});
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
    });

    test("User attempts to sign in correctly", async () => {
        const response = await request(app).post("/users/sign-in").send({
            email: "john.Doe@exampleemail.com",
            password: "123",
        });
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("userId");
    });

    test("User email not found", async () => {
        const response = await request(app).post("/users/sign-in").send({
            email: "john.Dole@exampleemail.com",
            password: "123",
        });
        expect(response.statusCode).toBe(400);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("error", "User not found");
    });

    test("Password incorrect", async () => {
        const response = await request(app).post("/users/sign-in").send({
            email: "john.Doe@exampleemail.com",
            password: "1234",
        });
        expect(response.statusCode).toBe(400);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.body).toHaveProperty("error", "Incorrect password");
    });
});