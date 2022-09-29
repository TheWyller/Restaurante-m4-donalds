import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedAdminRootLogin } from "../../mocks/session.mock";
import {
  mockedNewUser,
  mockedNoAdmin,
  mockedNoAdminLogin,
  mockedUserToUpdate,
  mockedUserToDelete,
  mockedUserToBeUpdate,
} from "../../mocks/user.mock";
import { IUser } from "../../../interfaces/users";

describe("/users", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) =>
        console.log("Error during Data Source initialization", err)
      );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  // CREATE
  test("CREATE /users - admin must be able to create a new user", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedNewUser);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUserToUpdate);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedNoAdmin);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("groupUser");
    expect(response.body).toHaveProperty("name");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");

    expect(response.body.name).toEqual("default_user");
    expect(response.body.email).toEqual("default@user.com");
    expect(response.body.isActive).toEqual(true);
    expect(response.status).toBe(201);
  });

  test("CREATE /users - admin should not be able to create a user that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedNoAdmin);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("CREATE /users - noAdmin must not be able to create a new user", async () => {
    const noAdminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${noAdminLoginResponse.body.token}`)
      .send(mockedNewUser);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("CREATE /users - noAdmin should not be able to create a user that already exists", async () => {
    const noAdminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${noAdminLoginResponse.body.token}`)
      .send(mockedNoAdmin);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  // READ
  test("READ /users - admin should be able to list users", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .get(`/users`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body.length > 0).toEqual(true);
    expect(response.status).toBe(200);
  });

  test("READ /users/:id - admin should be able to find a user", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const userToList = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .get(`/users/${userToList.body[1].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("groupUser");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.status).toBe(200);
  });

  test("READ /users - noAdmin should not be able to list users", async () => {
    const noAuthLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .get(`/users`)
      .set("Authorization", `Bearer ${noAuthLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("READ /users/:id - noAdmin should not be able to find a user", async () => {
    const noAuthLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const userToList = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .get(`/users/${userToList.body[0].id}`)
      .set("Authorization", `Bearer ${noAuthLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("READ /users/:id - noAdmin should not be able to find a user without authentication", async () => {
    const noAuthLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const noAuth = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${noAuthLoginResponse.body.token}`);

    const response = await request(app).get(`/users/${noAuth.body[0].id}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  // UPDATE
  test("UPDATE /users/:id - admin must be able to update a user", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const userToUpdate = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/users/${userToUpdate.body[2].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUserToBeUpdate);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(mockedUserToBeUpdate.name);
    expect(response.body.email).toBe(mockedUserToBeUpdate.email);
    expect(response.body).toHaveProperty("groupUser");
    expect(response.body.password).not.toBe(mockedUserToBeUpdate.password);
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");

    expect(response.body.name).toEqual("trainee");
    expect(response.body.email).toEqual("trainee@trainee.com");
    expect(response.body.isActive).toEqual(true);
    expect(response.status).toBe(200);

    //  "groupUser": {"id": 2, "name": "Usuário"}
  });

  test("UPDATE /users/:id - must not be able to update a user with a invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .patch(`/users/12312312312312312312312312312312`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUserToBeUpdate);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("UPDATE /users/:id - noAdmin should not be able to update a user", async () => {
    const noAdminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/users/35670563-5bba-332a-8b6d-5c23b37967db`)
      .set("Authorization", `Bearer ${noAdminLoginResponse.body.token}`)
      .send(mockedUserToBeUpdate);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  // DELETE

  test("DELETE /users/:id - admin should be able to delete user with isActive = true", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUserToDelete);

    const userToDelete = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const userRetired = userToDelete.body.find(
      (user: IUser) => user.name === "retired"
    );

    const response = await request(app)
      .delete(`/users/${userRetired.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(200);
  });

  test("DELETE /users/:id - admin should not be able to delete user with isActive = false", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const userToDelete = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const userRetired = userToDelete.body.find(
      (user: IUser) => user.name === "retired"
    );
    const response = await request(app)
      .delete(`/users/${userRetired.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("DELETE /users/:id - admin should not be able to delete user with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/users/35670563-5bba-332a-8b6d-5c23b37967db`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /users/:id - noAdmin should not be able to delete user with invalid id", async () => {
    const noAdminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/users/35670563-5bba-332a-8b6d-5c23b37967db`)
      .set("Authorization", `Bearer ${noAdminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /users/:id - noAdmin should not be able to delete a user", async () => {
    const noAdminLoginResponse = await request(app)
      .post("/login")
      .send(mockedNoAdminLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const userToDelete = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/users/${userToDelete.body[2].id}`)
      .set("Authorization", `Bearer ${noAdminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });
});
