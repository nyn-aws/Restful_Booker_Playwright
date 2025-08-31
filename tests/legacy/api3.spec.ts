// generate random data
// using @faker-js/faker library to generate the fake data
import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

// The faker library is used to generate fake (randomized) data for testing purposes.
// It can create realistic names, addresses, emails, dates, numbers, and much more.
// Most common usages include generating random user profiles, emails, phone numbers, dates, and other test data fields.
// This helps in testing APIs and applications with dynamic, unpredictable input data.

/*
Test: Create Booking with Random Data
Request Type: POST
Request Body: dynamic (using faker)
*/

test("Create Booking with Random Data", async ({ request }) => {
  // data and datetime generation using faker and luxon library
  const requestBody = {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: DateTime.now().toFormat("yyyy-MM-dd"),
      checkout: DateTime.now().plus({ day: 5 }).toFormat("yyyy-MM-dd"),
    },
    additionalneeds: faker.helpers.arrayElement([
      "Breakfast",
      "Lunch",
      "Dinner",
      "None",
    ]),
  };

  const response = await request.post(
    "https://restful-booker.herokuapp.com/booking",
    { data: requestBody }
  );

  const responseBody = await response.json();
  console.log(responseBody);

  // validation
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  expect(responseBody).toHaveProperty("bookingid");
  expect(responseBody.booking).toHaveProperty("bookingdates");

  // Partial match for dynamic data
  expect(responseBody.booking).toMatchObject({
    firstname: requestBody.firstname,
    lastname: requestBody.lastname,
    totalprice: requestBody.totalprice,
    depositpaid: requestBody.depositpaid,
    additionalneeds: requestBody.additionalneeds,
  });
  expect(responseBody.booking.bookingdates).toMatchObject({
    checkin: requestBody.bookingdates.checkin,
    checkout: requestBody.bookingdates.checkout,
  });
});
