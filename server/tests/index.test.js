const index = require("../routes/indexRouter");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api", index);

test("index route works", done => {
    request(app)
      .get("/api/about")
      .expect("Content-Type", /json/)
      .expect({ message: "This is the about section" })
      .expect(200, done);
  });