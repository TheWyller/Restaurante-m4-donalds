import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedCategory } from "../../mocks/category.mock";
import {
  mockedAdminRootLogin,
  mockedUser,
  mockedUserLogin,
} from "../../mocks/session.mock";

describe("/categories", () => {
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

  test("POST /categories -  Must be able to create category", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCategory);

    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(201);
  });

  test("POST /categories -  should not be able to create category that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("POST /categories -  should not be able to create category without authentication", async () => {
    const response = await request(app)
      .post("/categories")
      .send(mockedCategory);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /categories -  Must be able to list all categories", async () => {
    const response = await request(app).get("/categories");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  test("GET /categories/:id -  Must be able to list one category", async () => {
    const category = await request(app).get("/categories");
    const response = await request(app).get(
      `/categories/${category.body[0].id}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
  });

  test("GET /categories/:id -  Should not be able to list a category with invalid id", async () => {
    const response = await request(app).get(`/categories/13`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /categories/:id - ADM must be able to change a category", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .patch("/categories/1")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send({ name: "Comida" });

    expect(response.body.name).toEqual("Comida");
    expect(response.status).toBe(202);
  });

  test("PATCH /categories/:id - User must NOT be able to change a category", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const response = await request(app)
      .patch("/categories/1")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send({ name: "Alterado" });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE -  should not be able to delete category with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .delete(`/categories/9999999`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE -  Must be able to delete category with id", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedCategory);

    const response = await request(app)
      .delete(`/categories/2`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});
