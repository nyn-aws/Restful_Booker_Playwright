// PATCH request to partially update existing data
// Difference in PATCH and PUT requests
// PATCH is used to apply partial modifications to a resource
// PUT is used to replace the entire resource with a new representation

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

interface PatchRequestBody {
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  bookingdates?: {
    checkin?: string;
    checkout?: string;
  };
  additionalneeds?: string;
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
  const updatedRequestBody: PatchRequestBody = {
    firstname: firstName + "updated",
    lastname: lastName + "updated",
    additionalneeds: additionalNeeds + " updated",
  };

  const response2 = await request.patch(
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
  expectedData: PatchRequestBody
) => {
  // Only assert fields available in expected data
  if (expectedData.firstname) {
    expect(responseBody.firstname).toBe(expectedData.firstname);
  }
  if (expectedData.lastname) {
    expect(responseBody.lastname).toBe(expectedData.lastname);
  }
  if (expectedData.totalprice) {
    expect(responseBody.totalprice).toBe(expectedData.totalprice);
  }
  if (expectedData.depositpaid) {
    expect(responseBody.depositpaid).toBe(expectedData.depositpaid);
  }
  if (expectedData.bookingdates?.checkin) {
    expect(responseBody.bookingdates.checkin).toBe(
      expectedData.bookingdates.checkin
    );
  }
  if (expectedData.bookingdates?.checkout) {
    expect(responseBody.bookingdates.checkout).toBe(
      expectedData.bookingdates.checkout
    );
  }
  if (expectedData.additionalneeds) {
    expect(responseBody.additionalneeds).toBe(expectedData.additionalneeds);
  }
};
