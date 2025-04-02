// stores.test.ts
import { describe, it, expect, beforeEach } from "bun:test";
import { storesRoute } from "../routes/stores";
import type { Store } from "../routes/stores";

describe("Stores API (/stores)", () => {
  // --- GET / ---
  describe("GET /", () => {
    it("should return the initial list of stores", async () => {
      // 1. Simulate the GET request to the root path
      const res = await storesRoute.request("/");

      // 2. Assert the status code is 200 OK
      expect(res.status).toBe(200);

      // 3. Parse the JSON response body
      const body = await res.json();

      // 4. Assert the body has the expected structure
      expect(body).toHaveProperty("stores");
      expect(Array.isArray(body.stores)).toBe(true);

      // 5. Assert the initial number of stores (assuming no POST test ran before this)
      //    If run after a successful POST, this might be 4. Be careful with test order or add resets.
      //    Let's assume this runs first or state is predictable.
      expect(body.stores.length).toBe(3);

      // 6. Optionally, check some properties of the initial data
      expect(body.stores[0].name).toBe("Covent Garden");
    });
  });

  // --- POST /newStore ---
  describe("POST /newStore", () => {
    const newStoreData: Omit<Store, "id"> = {
      // Using Omit just in case you add an ID later; matches createPostSchema
      name: "Test Store",
      address: "123 Test Street, Testville",
      coordinates: [10.0, -10.0],
    };

    it("should add a new store successfully with valid data", async () => {
      // 1. Simulate the POST request with valid JSON data
      const res = await storesRoute.request("/newStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStoreData),
      });

      // 2. Assert the status code is 201 Created
      expect(res.status).toBe(201);

      // 3. Parse the JSON response body
      const body = await res.json();

      // 4. Assert the response body contains the data we sent
      expect(body).toEqual(newStoreData);

      // 5. **Verify the side effect:** Make a GET request to see if the store was added
      const getRes = await storesRoute.request("/");
      const getBody = await getRes.json();

      // 6. Assert the total number of stores has increased
      expect(getBody.stores.length).toBe(4); // Initial 3 + 1 new

      // 7. Assert the new store data is present in the list
      //    Using expect.objectContaining is flexible if order isn't guaranteed
      //    or if the object might have extra server-generated fields (like an ID later).
      expect(getBody.stores).toEqual(
        expect.arrayContaining([expect.objectContaining(newStoreData)])
      );
      // Or check the last element specifically if order is predictable
      expect(getBody.stores[3]).toEqual(newStoreData);
    });

    it("should return 400 Bad Request for invalid data (e.g., missing name)", async () => {
      const invalidData = {
        // name: "Missing Name Store", // Name is required
        address: "Invalid Address",
        coordinates: [0, 0],
      };

      // 1. Simulate POST request with invalid data
      const res = await storesRoute.request("/newStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      });

      // 2. Assert status code is 400 (Bad Request) - zValidator typically returns this
      expect(res.status).toBe(400);

      // 4. **Verify no side effect:** Make a GET request to ensure the invalid store wasn't added
      const getRes = await storesRoute.request("/");
      const getBody = await getRes.json();

      // 5. Assert the total number of stores hasn't changed unexpectedly

      expect(getBody.stores.length).toBe(4);
      expect(getBody.stores).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ address: "Invalid Address" }),
        ])
      );
    });

    it("should return 400 Bad Request for invalid data (e.g., name too short)", async () => {
      const invalidData = {
        name: "No", // Too short, min(3)
        address: "Valid Address Field",
        coordinates: [1, 1],
      };

      const res = await storesRoute.request("/newStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      });

      expect(res.status).toBe(400);

      // Verify state hasn't changed (still 4 stores from the successful POST)
      const getRes = await storesRoute.request("/");
      const getBody = await getRes.json();
      expect(getBody.stores.length).toBe(4);
    });
  });
});
