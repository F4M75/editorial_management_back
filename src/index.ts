import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import { swaggerSpec } from "./utils/swagger";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI:  http://localhost:${PORT}/api-docs`);
});

export default app;
