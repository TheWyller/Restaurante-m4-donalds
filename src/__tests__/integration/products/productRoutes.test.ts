import {
  mockedUserLogin,
  mockedAdminRootLogin,
  mockedUser,
} from "../../mocks/session.mock";
import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import { mockedCategory2 } from "../../mocks/category.mock";
import { mockedProduct } from "../../mocks/product.mock";

describe("/products", () => {
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

  test("POST /products - ADM Must be able to create a product", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedCategory2);

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedProduct);

    expect(response.body.newProduct).toHaveProperty("id");
    expect(response.body.newProduct).toHaveProperty("name");
    expect(response.body.newProduct).toHaveProperty("description");
    expect(response.body.newProduct).toHaveProperty("image");
    expect(response.body.newProduct).toHaveProperty("price");
    expect(response.body.newProduct).toHaveProperty("category");
    expect(response.body.newProduct.category).toHaveProperty("id");
    expect(response.body.newProduct.category).toHaveProperty("name");

    expect(response.body.newProduct.name).toEqual("Cola Coke");
    expect(response.body.newProduct.price).toEqual(5);

    expect(response.status).toBe(201);
  });

  test("POST /products - Must NOT be able to create a same name product", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedProduct);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Product already exists");

    expect(response.status).toBe(400);
  });

  test("GET /products - Is not possible get products without login", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /products - Should list all registered products", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("map");
    expect(response.status).toBe(200);
  });

  test("GET /products/:id - Is not possible get specific product without login", async () => {
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /products/:id - Is not possible get specific if he is not exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const response = await request(app)
      .get("/products/10")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /products/id - Is not possible delete specific product without login", async () => {
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /products/id - Should not delete product in the database without adm", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "ovo",
        description: "teste do ovo",
        image: "imagem",
        price: "10.99",
        categoryId: "1",
      });

    const responseProductsAdmin = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedUser);

    const mockedUserResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const response = await request(app)
      .delete(`/products/${responseProductsAdmin.body[0]?.id}`)
      .set("Authorization", `Bearer ${mockedUserResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /products/id - Should patch correct product in the database", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/products/${listProducts.body[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "ovo teste 2",
        description: "teste do ovo 2",
        image: "imagem 2",
        price: "15.99",
        categoryId: "1",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", listProducts.body[0].id);
  });

  test("PATCH /products/id - Should patch product in the database without adm", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    const mockedUser = await request(app).post("/login").send(mockedUserLogin);
    const response = await request(app)
      .delete(`/products/${listProducts.body[0].id}`)
      .set("Authorization", `Bearer ${mockedUser.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /products/id - Is not possible patch specific product without login", async () => {
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /products/id - Should delete the correct product in the database", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const response = await request(app)
      .delete("/products/1")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /products/:id - Must be able to get a product by ID", async () => {
    const adminLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    await request(app)
      .post("/products")
      .send(mockedProduct)
      .set("Authorization", `Bearer ${adminLogin.body.token}`);
    const product = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${userLogin.body.token}`);
    const response = await request(app)
      .get(`/products/${product.body[0].id}`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("price");
    expect(response.body.category).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  test("GET /products/:id - Should not be able to get a product by ID without auth", async () => {
    const userLogin = await request(app).post("/login").send(mockedUserLogin);
    const user = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${userLogin.body.token}`);
    const response = await request(app)
      .get(`/users/${user.body[0].id}`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("GET /products/:id - Should not be able to get a product with a invalid ID", async () => {
    const rootLogin = await request(app)
      .post("/login")
      .send(mockedAdminRootLogin);

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${rootLogin.body.token}`)
      .send(mockedUser);

    const userLogin = await request(app).post("/login").send(mockedUserLogin);

    const response = await request(app)
      .get("/products/1234")
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
