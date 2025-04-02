import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";
import { storesRoute } from "./routes/stores";

const app = new Hono();

app.use("*", logger());

app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

// api
app.route("/api/expenses", expensesRoute);

// stores route
app.route("/api/stores", storesRoute);

export default app;
