import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Store type
const storeSchema = z.object({
  name: z.string().min(3).max(100),
  address: z.string().min(3).max(100),
  coordinates: z.tuple([
    z.number(), // Latitude
    z.number(), // Longitude
  ]),
});

export type Store = z.infer<typeof storeSchema>;

const createPostSchema = storeSchema;

// Fake expenses
const storeData: Store[] = [
  {
    name: "Covent Garden",
    address: "6 Slingsby Place, London, WC2E 9AB",
    coordinates: [51.5127248, -0.1287614], // [lat, lng]
  },
  {
    name: "Mayfair",
    address: "The House of ELEMIS, 2 Lancashire Court, London, W1S 1EX",
    coordinates: [51.5125376, -0.1478229], // [lat, lng]
  },
  {
    name: "Victoria",
    address: "John Lewis & Partners, 171 Victoria St, London SW1E 5NN",
    coordinates: [51.495898, -0.142044],
  },
];

export const storesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ stores: storeData });
  })

  .post("/newStore", zValidator("json", createPostSchema), async (c) => {
    const store = await c.req.valid("json");
    storeData.push(store);
    c.status(201);
    return c.json(store);
  });
