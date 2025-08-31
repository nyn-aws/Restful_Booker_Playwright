// PUT request to update existing data

import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

let tokenValue: string;

test.beforeEach(async ({ request }) => {
  const response = await request.post(
    "https://restful-booker.herokuapp.com/auth",
    {
      data: {
        username: "admin",
        password: "password123",
      },
    }
  );
  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty("token");
  tokenValue = responseBody.token;
});

test("Create Booking with Random Data and Update the booking details after booking", async ({
  request,
}) => {
  // Generate random booking data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int({ min: 50, max: 1000 });
  const depositPaid = faker.datatype.boolean();
  const checkinDate = DateTime.now().toFormat("yyyy-MM-dd");
  const checkoutDate = DateTime.now().plus({ days: 5 }).toFormat("yyyy-MM-dd");
  const additionalNeeds = faker.helpers.arrayElement([
    "Breakfast",
    "Lunch",
    "Dinner",
  ]);

  const requestBody: Booking = {
    firstname: firstName,
    lastname: lastName,
    totalprice: totalPrice,
    depositpaid: depositPaid,
    bookingdates: {
      checkin: checkinDate,
      checkout: checkoutDate,
    },
    additionalneeds: additionalNeeds,
  };

  // Create booking
  const response = await request.post(
    "https://restful-booker.herokuapp.com/booking",
    { data: requestBody }
  );
  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty("bookingid");
  expect(responseBody).toHaveProperty("booking");
  await validateBookingResponse(responseBody.booking, requestBody);
  console.log(responseBody);

  const bookingId = responseBody.bookingid;

  // Update booking
  const updatedRequestBody: Booking = {
    firstname: firstName + "updated",
    lastname: lastName + "updated",
    totalprice: 1234,
    depositpaid: false,
    bookingdates: {
      checkin: checkinDate,
      checkout: checkoutDate,
    },
    additionalneeds: additionalNeeds + " updated",
  };

  const response2 = await request.put(
    `https://restful-booker.herokuapp.com/booking/${bookingId}`,
    {
      data: updatedRequestBody,
      headers: {
        Cookie: `token=${tokenValue}`,
        Accept: "application/json",
      },
    }
  );
  expect(response2.ok()).toBeTruthy();
  const response2Body = await response2.json();
  await validateBookingResponse(response2Body, updatedRequestBody);
  console.log(response2Body);

  // Get booking and validate update
  const response3 = await request.get(
    `https://restful-booker.herokuapp.com/booking/${bookingId}`
  );
  expect(response3.ok()).toBeTruthy();
  const response3Body = await response3.json();
  await validateBookingResponse(response3Body, updatedRequestBody);
  console.log(response3Body);
});

// Reusable assertion method for responseBody validations
const validateBookingResponse = async (
  responseBody: Booking,
  expectedData: Booking
) => {
  expect(responseBody.firstname).toBe(expectedData.firstname);
  expect(responseBody.lastname).toBe(expectedData.lastname);
  expect(responseBody.totalprice).toBe(expectedData.totalprice);
  expect(responseBody.depositpaid).toBe(expectedData.depositpaid);
  expect(responseBody.bookingdates.checkin).toBe(
    expectedData.bookingdates.checkin
  );
  expect(responseBody.bookingdates.checkout).toBe(
    expectedData.bookingdates.checkout
  );
  expect(responseBody.additionalneeds).toBe(expectedData.additionalneeds);
};
