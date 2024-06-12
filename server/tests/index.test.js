const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

beforeAll(done => {
  done();
});

describe("Test index route", () => {
  
  test("index route works", done => {
    request(app)
      .get("/api/about")
      .expect("Content-Type", /json/)
      .expect({ message: "This is the about section" })
      .expect(200, done);
  });
  
  })

afterAll(done => {
  mongoose.connection.close()
  done()
});