import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { mockedTable } from "../../mocks/tables.mock";
import {
  mockedAdminRootLogin,
  mockedUser,
  mockedUserLogin,
} from "../../mocks/session.mock";

describe("/tables", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /table - ADM Must be able to create a table", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .post("/tables")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedTable);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("size");
    expect(response.body).toHaveProperty("inUse");
    expect(response.body).toHaveProperty("subTotal");

    expect(response.body.inUse).toEqual(false);
    expect(response.body.subTotal).toEqual("0.00");
    expect(response.body.size).toEqual(mockedTable.size);

    expect(response.status).toBe(201);
  });

  test("POST /table - USER Must NOT be able to create a table", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLoginTest = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    if (userLoginTest.body.token === undefined) {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${rootLogin.body.token}`)
        .send(mockedUser);
    }

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const response = await request(app)
      .post("/tables")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send(mockedTable);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("GET /table - Must be able to list all tables", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    const response = await request(app)
      .get("/tables")
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("order");
    expect(response.body[0]).toHaveProperty("size");
    expect(response.body[0]).toHaveProperty("inUse");
    expect(response.body[0]).toHaveProperty("subTotal");

    expect(response.status).toBe(200);
  });

  test("GET /table/:id - Must be able to list a table", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    const response = await request(app)
      .get("/tables/1")
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("order");
    expect(response.body).toHaveProperty("size");
    expect(response.body).toHaveProperty("inUse");
    expect(response.body).toHaveProperty("subTotal");

    expect(response.status).toBe(200);
  });

  test("PATCH /table/:id - ADM must be able to change a table", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .patch("/tables/1")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send({ size: 99 });

    expect(response.body.size).toEqual(99);
    expect(response.status).toBe(202);
  });

  test("PATCH /table/:id - User must NOT be able to change a table", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const response = await request(app)
      .patch("/tables/1")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send({ size: 10 });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /table/:id - ADM must be able to delete a table", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const getTables = await request(app).get("/tables");

    if (getTables.body.length === 1) {
      await request(app)
        .post("/tables")
        .set("Authorization", `Bearer ${rootLogin.body.token}`)
        .send(mockedTable);
    }

    const newGetTables = await request(app)
      .get("/tables")
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    const lastTable = newGetTables.body.length - 1;

    let numId = 0;

    if (newGetTables.body[lastTable].id === 1) {
      numId = 0;
    } else {
      numId = lastTable;
    }

    const getTableById = await request(app)
      .get(`/tables/${newGetTables.body[numId].id}`)
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    const response = await request(app)
      .delete(`/tables/${getTableById.body.id}`)
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(200);
  });

  test("DELETE /table/:id - User must NOT be able to delete a table", async () => {
    const userLogin = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .delete(`/tables/1`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("You are not a Adm");
    expect(response.status).toBe(403);
  });

  test("GET /tables/:id - Must be able to get a table by ID", async () => {
    await request(app).post("/tables").send(mockedTable);
    const userLogin = await request(app).post("/login").send(mockedUser);
    const table = await request(app)
      .get("/tables")
      .set("Authorization", `Bearer ${userLogin.body.token}`);
    const response = await request(app)
      .get(`/tables/${table.body[0].id}`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("subTotal");
    expect(response.body).toHaveProperty("size");
    expect(response.body).toHaveProperty("inUse");
    expect(response.body).toHaveProperty("order");
    expect(response.status).toBe(200);
  });

  test("GET /tables/:id - Should not be able to get a table by ID without auth", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    const table = await request(app)
      .get("/tables")
      .set("Authorization", `Bearer ${userLogin.body.token}`);
    const response = await request(app).get(`/tables/${table.body[0].id}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /tables/:id - Should not be able to get a table with a invalid ID", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    const response = await request(app)
      .get("/tables/1234")
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
