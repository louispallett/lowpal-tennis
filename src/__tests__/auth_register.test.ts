import { POST } from "@/app/api/auth/register/route";

describe("API for User model", () => {
  it("Creates a user", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "John.Doe@example.com",
        mobCode: "+44",
        mobile: "6701564720", // randomly generated...
        password: "HelloWorld1!",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.firstName).toBe("John");
  });

  it("Trims data successfully", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: " John.Doe@example.com ",
        mobCode: "+44",
        mobile: "6701564720",
        password: "HelloWorld1!",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.email).toBe("john.doe@example.com");
  });

  it("Returns error for weak passwords", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "John.Doe@example.com",
        password: "HelloWorld1",
        passkey: process.env.PASS_KEY,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
