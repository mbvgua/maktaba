import supertest from "supertest";

import app from "./app";

const request = supertest(app);

describe("[server tests]", () => {
    it("should ensure server is running", async()=>{
        expect(request).toBeDefined()
    })
});
