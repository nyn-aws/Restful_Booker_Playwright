import { test, expect } from "@playwright/test";

/*
Test: Create Booking
Request Type: POST
Request Body: static 
*/

test("Create Booking", async ({ request }) => {
  const requestBody = {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2018-01-01",
      checkout: "2019-01-01",
    },
    additionalneeds: "Breakfast",
  };

  const response = await request.post(
    "https://restful-booker.herokuapp.com/booking",
    { data: requestBody }
  );

  //   response contains everything: body,cookies,headers
  //   If you want to extract only body
  const responseBody = await response.json();
  console.log(responseBody);

  // validation
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  // JSON data validation : we use tohaveproperty
  expect(responseBody).toHaveProperty("bookingid");
  expect(responseBody.booking).toHaveProperty("bookingdates");

  expect(responseBody.booking).toMatchObject({
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,

    additionalneeds: "Breakfast",
  });
  expect(responseBody.booking.bookingdates).toMatchObject({
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  });
});
