import { Hono } from "hono";
import { z } from "zod";

// Expenses type
type Expense = {
    id: number,
    title: string,
    amount: number,
    expenseType: string
}

// Fake expenses

const fakeExpenses: Expense[] = [
    {
      id: 1,
      title: "Grocery Shopping",
      amount: 156.75,
      expenseType: "house"

    },
    {
      id: 2,
      title: "Internet Bill",
      amount: 89.99,
      expenseType: "house"
    },
    {
      id: 3,
      title: "Gas and Electric",
      amount: 245.50,
      expenseType: "house"
    },
    {
      id: 4,
      title: "Car Insurance",
      amount: 178.00,
      expenseType: "car"
    },
    {
      id: 5,
      title: "Phone Bill",
      amount: 75.99,
      expenseType: "house"
    },
    {
      id: 6,
      title: "Netflix Subscription",
      amount: 19.99,
      expenseType: "house"
    }
];

const createPostSchema = z.object({
    title: z.string(),
    amount: z.number(),
    expenseType: z.string()
})

export const expensesRoute = new Hono()
    .get("/", (c) => {
        return c.json({ expenses: fakeExpenses});
    })
    .post("/", async (c) => {
        const data = await c.req.json()
        const expense = createPostSchema.parse(data)
        console.log({expense})
        return c.json(expense);
    })