import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Expenses type
const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
  expenseType: z.string().min(3).max(100),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

// Fake expenses
const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Grocery Shopping",
    amount: 156.75,
    expenseType: "house",
  },
  {
    id: 2,
    title: "Internet Bill",
    amount: 89.99,
    expenseType: "house",
  },
  {
    id: 3,
    title: "Gas and Electric",
    amount: 245.5,
    expenseType: "house",
  },
  {
    id: 4,
    title: "Car Insurance",
    amount: 178.0,
    expenseType: "car",
  },
  {
    id: 5,
    title: "Phone Bill",
    amount: 75.99,
    expenseType: "house",
  },
  {
    id: 6,
    title: "Netflix Subscription",
    amount: 19.99,
    expenseType: "house",
  },
];

export const expensesRoute = new Hono()
  // GET -> all expenses
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  // GET -> all expenses
  .get("/total-spent", (c) => {
    const totalSpent = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(expense);
  })
  // dynamic route parameter regex to ensure is only a number
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deletedExpense });
  });
