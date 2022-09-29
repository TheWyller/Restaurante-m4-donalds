import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { IProduct } from "../../../interfaces/product";
import { mockedCategory3 } from "../../mocks/category.mock";
import { mockedOrder } from "../../mocks/order.mock";
import { mockedOrderProduct } from "../../mocks/orderProduct.mock";
import { mockedProduct2 } from "../../mocks/product.mock";
import { mockedAdminRootLogin } from "../../mocks/session.mock";
import { mockedTable } from "../../mocks/tables.mock";

describe("/orders/product", () => {
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

  test("POST /orders/product - User Must be able to join a product in a order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/tables")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedTable);

    await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedOrder);

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedCategory3);

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedProduct2);

    const allProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    const idProduct = allProducts.body.filter(
      (elem: IProduct) => elem.name === "Cola Origin"
    );
    const response = await request(app)
      .post("/orders/product")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send({
        idOrder: 1,
        idProduct: idProduct.id,
      });

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Product set in Order with success");

    expect(response.status).toBe(201);
  });

  test("POST /orders/product - Must be Logged to join a product in a order", async () => {
    const response = await request(app)
      .post("/orders/product")
      .send(mockedOrderProduct);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Invalid token");

    expect(response.status).toBe(401);
  });

  test("DELETE /orders/product/:id - ADM Must be able to delete order", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const order = await request(app)
      .get(`/orders/1`)
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    const response = await request(app)
      .delete(`/orders/product/${order.body.orderProduct[0].id}`)
      .set("Authorization", `Bearer ${rootLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Product deleted with success");

    expect(response.status).toBe(202);
  });
});
