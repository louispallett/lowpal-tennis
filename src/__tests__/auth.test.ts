import { POST } from "@/app/api/auth/route";
import User from "@/models/User";
import bcrypt from "bcryptjs";

describe("Auth route (Sign in)", () => {
    beforeEach(async () => {
        await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            mobCode: "+44",
            mobile: "6701564720",
            password: await bcrypt.hash("HelloWorld1!", 12),
        });
    });
    
    describe("API route for Sign In (correct credentials)", () => {
        it("Should return OK for correct sign in", async () => {
            const req = new Request("http:localhost/api/auth", {
                method: "POST",
                body: JSON.stringify({
                    email: "john.doe@example.com",
                    password: "HelloWorld1!"
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await POST(req);
    
            expect(res.status).toBe(200);
        });
    });
    
    describe("API route for Sign In (incorrect credentials)", () => {
        it("Should return 401 with incorrect email", async () => {
            const req = new Request("http:localhost/api/auth", {
                method: "POST",
                body: JSON.stringify({
                    email: "Jon.Doe@example.com",
                    password: "HelloWorld2!"
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await POST(req);
            const json = await res.json();
    
            expect(res.status).toBe(401);
            expect(json.message).toBe("User not found");
        });
    
        it("Should return 401 with incorrect password", async () => {
            const req = new Request("http:localhost/api/auth", {
                method: "POST",
                body: JSON.stringify({
                    email: "john.doe@example.com",
                    password: "HelloWorld1"
                }),
                headers: { "Content-Type": "application/json" }
            });
        
            const res = await POST(req);
            const json = await res.json();
        
            expect(res.status).toBe(401);
            expect(json.message).toBe("Incorrect Password");
        });
    });
})
