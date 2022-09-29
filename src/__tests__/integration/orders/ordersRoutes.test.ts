import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { mockedOrder } from "../../mocks/order.mock";
import {
  mockedAdminRootLogin,
  mockedUser,
  mockedUserLogin,
} from "../../mocks/session.mock";
import { mockedTable } from "../../mocks/tables.mock";
import { mockedNoAdminLogin } from "../../mocks/user.mock";

describe("/orders", () => {
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

  test("POST /orders - Must be able to create a order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/tables")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedTable);

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedOrder);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("isPaid");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("table");
    expect(response.body).toHaveProperty("user");

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.table).toHaveProperty("id");

    expect(response.status).toBe(201);
  });

  test("GET /orders/users/:id - Must be able to get orders by user ID", async () => {
    const adminLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const order = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send(mockedOrder);

    const response = await request(app)
      .get(`/orders/users/${order.body.user.id}`)
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("orders");
    expect(response.body).toHaveProperty("groupUser");
    expect(response.body.groupUser).toHaveProperty("id");
    expect(response.body.groupUser).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  test("GET /orders/users/:id - Should not be able to get orders by user ID without ADM auth", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const order = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send(mockedOrder);

    const response = await request(app)
      .get(`/orders/users/${order.body.user.id}`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("GET /orders/users/:id - Should not be able to get orders with a invalid user ID", async () => {
    const adminLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .get("/orders/users/1234")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("GET /orders - Must be able to list orders", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    expect(response.body.length > 0).toBe(true);
    expect(response.status).toBe(200);
  });

  test("GET /orders - Must not be able to list orders", async () => {
    const noAuthLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const noAuth = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${noAuthLoginResponse.body.token}`);
    const response = await request(app).get(`/users/${noAuth.body[0].id}`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /orders - ADM must be able to list an order by ID", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .get("/orders/1")
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("isPaid");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("table");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.table).toHaveProperty("id");
    expect(response.body.table).toHaveProperty("inUse");
    expect(response.status).toBe(200);
  });

  test("GET /orders - User must be able to list an order by ID", async () => {
    const noAuthLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const response = await request(app)
      .get("/orders/1")
      .set("Authorization", `Bearer ${noAuthLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("isPaid");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("table");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.table).toHaveProperty("id");
    expect(response.body.table).toHaveProperty("inUse");
    expect(response.status).toBe(200);
  });

  test("GET /orders - Must be Loged to list an order by ID", async () => {
    const response = await request(app).get("/orders/1");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /orders/:id - ADM Must be able to update a order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .patch("/orders/1")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send({ isPaid: true });

    expect(response.body.isPaid).toEqual(true);
    expect(response.status).toBe(202);
  });

  test("PATCH /orders/:id - User Must not be able to update a order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const response = await request(app)
      .patch("/orders/1")
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .send({ isPaid: true });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /orders/:id - Must be able to delete an order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const order = await request(app)
      .post("/orders")
      .send(mockedOrder)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    const response = await request(app)
      .delete(`/orders/${order.body.id}`)
      .send(mockedOrder)
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Order deleted with success");
    expect(response.status).toBe(202);
  });

  test("DELETE /orders/:id - Shout not be able to delete an order without admin auth", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const order = await request(app)
      .post("/orders")
      .send(mockedOrder)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    const response = await request(app)
      .delete(`/orders/${order.body.id}`)
      .send(mockedOrder)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /orders/:id - Shout not be able to delete an order with invalid ID", async () => {
    const adminLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .delete(`/orders/1234`)
      .send(mockedOrder)
      .set("Authorization", `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
