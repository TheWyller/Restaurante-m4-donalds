import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
  mockedAdminLogin,
  mockedUser,
  mockedUserLogin,
} from "../../mocks/sessionsRoutes.mock";

describe("/users", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("GET /users/:id - Must be able to get a user by ID", async () => {
    await request(app).post("/users").send(mockedUser);
    const adminLogin = await request(app).post("/login").send(mockedAdminLogin);
    const user = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);
    const response = await request(app)
      .get(`/users/${user.body[0].id}`)
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("groupUser");
    expect(response.status).toBe(200);
  });

  test("GET /users/:id - Should not be able to get a user by ID without admin auth", async () => {
    const adminLogin = await request(app).post("/login").send(mockedAdminLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const user = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    const response = await request(app)
      .get(`/users/${user.body[0].id}`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("GET /users/:id - Should not be able to get a user with a invalid ID", async () => {
    const adminLogin = await request(app).post("/login").send(mockedAdminLogin);
    const response = await request(app)
      .get("/users/1234")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
