import { test, expect } from "@playwright/test";

// Handling path parameters

test("GET booking details by ID: Path Parameter", async ({ request }) => {
  const booking_id = 1;
  const response = await request.get(
    `https://restful-booker.herokuapp.com/booking/${booking_id}`
  );

  //   Question: explain difference between response.ok and response.status?
  //   response.ok is a boolean indicating if the response status is in the range 200-299
  //   response.status() returns the actual status code (e.g., 200, 404)
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Response Body:", responseBody);
});

// Handling Query Parameters

test("GET Booking ID by firstname and Lastname :Query Params", async ({
  request,
}) => {
  const response = await request.get(
    `https://restful-booker.herokuapp.com/booking`,
    {
      params: {
        firstname: "James",
        lastname: "Brown",
      },
    }
  );
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Response Body:", responseBody);
  console.log("Type of Response Body:", typeof responseBody);
  //   assertion to validate response body is not empty
  expect(responseBody.length).toBeGreaterThan(0);
  expect(responseBody).not.toBeNull();
  expect(responseBody).toBeDefined();

  for (const booking of responseBody) {
    expect(booking).toHaveProperty("bookingid");
  }
});
