import app from "./app";
import AppDataSource from "./data-source";
import "dotenv/config";
import { createGroup } from "./helpers";

(async () => {
  await AppDataSource.initialize().catch(async (err) => {
    console.error("Error during Data Source initialization", err);
  });
  app.listen(process.env.PORT || 3000, async () => {
    await createGroup();
    console.log("Servidor executando");
  });
})();
