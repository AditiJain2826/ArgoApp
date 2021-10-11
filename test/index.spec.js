const request = require("supertest");
const app = require("../src/config/express");
const db = require("../src/database/database.schema");

const accessToken = 'Bearer ya29.a0ARrdaM98AzYRFsQRCoVvYT7XO81lFLp3SjEhIEFyYKG0QbUaktloOipFhS2b39ZYVGTFsayEmOOLLuY4Fm7YGtAOe6GgHWzUYfESENXjntPUKWuMqRsMD4BBtazKsShtepNmmhM-sUUdCvHMBsG-WtznqMOO'

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  await db.User.create({
    id: '113156368427314298982',
    googleId: '113156368427314298982',
    username: 'g_aditi_jain',
    family_name: 'jain',
    given_name: 'aditi',
    email: 'aditijain2826@gmail.com'
  })
});

describe("Organization", () => {
  let id;
  it("Create Organization", async () => {
    const { body, status } = await request(app).post("/organization").set('Authorization', [accessToken])
    .send({
      name: "testorg",
    });
    id = body.id;
    expect(status).toBe(201);
    expect(body).toMatchObject({ id: 1, name: "testorg" });
  });

  it("Update Organization", async () => {
    const { body, status } = await request(app)
      .patch(`/organization/${id}`).set('Authorization', [accessToken])
      .send({
        name: "testorg1",
      });
    expect(status).toBe(201);
    expect(body).toMatchObject({ message: "Updated successfully!" });
  });

  it("Update Organization - 409", async () => {
    const { body, status } = await request(app)
      .patch(`/organization/101`).set('Authorization', [accessToken])
      .send({
        name: "testorg1",
      });
    expect(status).toBe(409);
  });

  it("List Organizations", async () => {
    const { body, status } = await request(app).get("/organization").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

  it("Get Organization details by ID", async () => {
    const { body, status } = await request(app).get("/organization/1").set('Authorization', [accessToken]);
    expect(status).toBe(200);
  });
});

describe("Property", () => {
  let id;
  it("Create Property", async () => {
    const { body, status } = await request(app).post("/property").send({
      name: "testproperty",
      OrganizationId: 1
    }).set('Authorization', [accessToken]);
    id = body.id;
    expect(status).toBe(201);
    expect(body).toMatchObject({ id: 1, name: "testproperty" });
  });

  it("Update Property", async () => {
    const { body, status } = await request(app)
      .patch(`/property/${id}`).set('Authorization', [accessToken])
      .send({
        name: "testproperty1",
      });
    expect(status).toBe(201);
    expect(body).toMatchObject({ message: "Updated successfully!" });
  });

  it("Update Property - 404", async () => {
    const { body, status } = await request(app)
      .patch(`/property/101`).set('Authorization', [accessToken])
      .send({
        name: "testproperty1",
      });
    expect(status).toBe(404);
    expect(body).toMatchObject({ message: "Not Found" });
  });

  it("List Property", async () => {
    const { body, status } = await request(app).get("/property").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

});

describe("Region", () => {
  let id;
  it("Create Region", async () => {
    const { body, status } = await request(app).post("/region").send({
      name: "testregion",
      PropertyId: 1
    }).set('Authorization', [accessToken]);
    id = body.id;
    expect(status).toBe(201);
    expect(body).toMatchObject({ id: 1, name: "testregion" });
  });

  it("Update Region", async () => {
    const { body, status } = await request(app)
      .patch(`/region/${id}`)
      .send({
        name: "testregion1"
      }).set('Authorization', [accessToken]);
    expect(status).toBe(201);
    expect(body).toMatchObject({ message: "Updated successfully!" });
  });

  it("Update Region - 404", async () => {
    const { body, status } = await request(app)
      .patch(`/region/101`).set('Authorization', [accessToken])
      .send({
        name: "testregion",
      });
    expect(status).toBe(404);
    expect(body).toMatchObject({ message: "Not Found" });
  });

  it("List Region", async () => {
    const { body, status } = await request(app).get("/region").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

});

describe("Field", () => {
  let id;
  it("Create Field", async () => {
    const { body, status } = await request(app).post("/field").send({
      name: "field1",
      RegionId: 1,
      size: "189 sqft",
      position: "17 22"
    }).set('Authorization', [accessToken]);
    id = body.id;
    expect(status).toBe(201);
  });

  it("Update Field", async () => {
    const { body, status } = await request(app)
      .patch(`/field/${id}`)
      .send({
        name: "testfield1",
      }).set('Authorization', [accessToken]);
    expect(status).toBe(201);
    expect(body).toMatchObject({ message: "Updated successfully!" });
  });

  it("Update Field - 404", async () => {
    const { body, status } = await request(app)
      .patch(`/field/101`).set('Authorization', [accessToken])
      .send({
        name: "testfield",
      });
    expect(status).toBe(404);
    expect(body).toMatchObject({ message: "Not Found" });
  });

  it("List Field", async () => {
    const { body, status } = await request(app).get("/field").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

});

describe("Crop", () => {
  let id;
  it("Create Crop", async () => {
    const { body, status } = await request(app).post("/crop").set('Authorization', [accessToken]).send({
        "name": "Cotton"
    });
    expect(status).toBe(201);
  });

  it("List Crop", async () => {
    const { body, status } = await request(app).get("/crop").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

});

describe("Crop Cycle", () => {
  let id;
  it("Create Crop Cycle", async () => {
    const { body, status } = await request(app).post("/cropcycle").send({
      "fieldId":1,
      "cropId":1,
      "startmonth": 4,
      "endmonth": 8,
      "startyear": 2021,
      "endyear": 2021
    }).set('Authorization', [accessToken]);
    id = body.id;
    expect(status).toBe(201);
  });

  it("Create Crop Cycle - 400 ", async () => {
    const { body, status } = await request(app).post("/cropcycle").send({
      "fieldId":1
    }).set('Authorization', [accessToken]);
    id = body.id;
    expect(status).toBe(400);
  });

  it("List Crop Cycle", async () => {
    const { body, status } = await request(app).get("/cropcycle").set('Authorization', [accessToken]);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
  });

});

describe("Delete", () => {
  it("Delete Field", async () => {
    const { status } = await request(app).delete("/field/1").set('Authorization', [accessToken])
    expect(status).toBe(200);
  });

  it("Delete Field - 404", async () => {
    const { status } = await request(app).delete("/field/101").set('Authorization', [accessToken])
    expect(status).toBe(404);
  });

  it("Delete Region", async () => {
    const { status } = await request(app).delete("/region/1").set('Authorization', [accessToken])
    expect(status).toBe(200);
  });

  it("Delete Region - 404", async () => {
    const { status } = await request(app).delete("/region/101").set('Authorization', [accessToken])
    expect(status).toBe(404);
  });

  it("Delete Property", async () => {
    const { status } = await request(app).delete("/property/1").set('Authorization', [accessToken])
    expect(status).toBe(200);
  });

  it("Delete Property - 404", async () => {
    const { status } = await request(app).delete("/property/101").set('Authorization', [accessToken])
    expect(status).toBe(404);
  });
  
  it("Delete Organization", async () => {
    const { status } = await request(app).delete("/organization/1").set('Authorization', [accessToken])
    expect(status).toBe(200);
  });

  it("Delete Organization - 404", async () => {
    const { status } = await request(app).delete("/organization/101").set('Authorization', [accessToken])
    expect(status).toBe(404);
  });

});


afterAll(() => db.sequelize.close())
