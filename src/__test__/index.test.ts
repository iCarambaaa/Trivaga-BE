import server from "../server";
import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(server);

describe("hello test test test jest", () => {
  beforeAll((done) => {
    console.log("This gets run before all tests in this suite");

    mongoose.connect(process.env.MONGO_URL_TEST!).then(() => {
      console.log("Connected to the test database");
      done();
    });
  });


  const validAccommodation = {
    name: "Test Product",
    description: "nice",
    maxGuests: 10,
    city: "San Francisco",
  };

  let _id: string;

  console.log('========================>', validAccommodation)
  it("should check that the POST /accommodation endpoint creates a new product", async () => {
    const response = await request
      .post("/accommodation")
      .send(validAccommodation);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.description).toBeDefined();
    expect(response.body.maxGuests).toBeDefined();
    expect(response.body.city).toBeDefined();
    _id = response.body._id;
  });

  it("should check that the GET /accommodation endpoint returns a success message", async () => {
    const response = await request.get("/accommodation");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should check that the GET /accommodation/:id endpoint returns a success message", async () => {
    const response = await request.get("/accommodation/" + _id);

    expect(response.status).toBe(200);
  });

  it("should check that the GET /accommodation/:id endpoint returns a 404 error when the product does not exist", async () => {
    const response = await request.get("/accommodation/123456789");

    expect(response.status).toBe(404);
  });

  it("should check that the PUT /accommodation/:id endpoint returns a 404 error when the product does not exist", async () => {
    const response = await request.put("/accommodation/1").send({
      name: "Test Product 2",
      description: "nice",
      maxGuests: 10,
      city: "San Francisco",
    });

    expect(response.status).toBe(404);
  });

  it("should check that the PUT /accommodation/:id endpoint returns a 203 when the product does exist", async () => {
    const response = await request.put(/accommodation/ + _id).send({
      name: "Test Product 23",
      description: "nice, nice",
      maxGuests: 110,
      city: "San Francisco",
    });

    expect(response.status).toBe(203);
  });

  it("should check that the DELETE /accommodation/:id endpoint returns a 204 when the product does exist", async () => {
    const response = await request.delete(/accommodation/ + _id);
    expect(response.status).toBe(204);
  });

  it("should check that the DELETE /accommodation/:id endpoint returns a 404 when the product does not exist", async () => {
    const response = await request.delete("/accommodation/123");
    expect(response.status).toBe(404);
  });

  it("should check that the GET /destinations endpoint returns 200", async () => {
    const response = await request.get("/destinations");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should check that the GET /destinations endpoint returns a success message", async () => {
    const response = await request.get("/destinations/San20%Francisco");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  afterAll((done) => {
    mongoose.connection
      .dropDatabase()
      .then(() => {
        return mongoose.connection.close();
      })
      .then(() => {
        done();
      });
  });
});
