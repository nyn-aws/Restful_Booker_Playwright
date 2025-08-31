import { test, expect } from "@playwright/test";

// No auth API(Public APIS)
test("public apis", async ({ request }) => {
  const response = await request.get(
    "https://restful-booker.herokuapp.com/ping"
  );
  expect(response.status()).toBe(201);
});

// Basic Auth(username and password)

test("basic auth", async ({ request }) => {
  const response = await request.get(
    "https://httpbin.org/basic-auth/user/pass",
    {
      headers: {
        Authorization: `Basic ` + Buffer.from("user:pass").toString("base64"),
      },
    }
  );
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  console.log(await response.json());
  //   console.log(response);
});

//
