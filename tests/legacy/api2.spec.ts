// getting data from json
import { test, expect } from "@playwright/test";
import fs from "fs";
/*
Test: Create Booking
Request Type: POST
Request Body: static 
*/

test("Create Booking", async ({ request }) => {
  // read data from json
  const jsonFile = "tests/legacy/json_request_body1.json";
  const requestBody = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

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

  //   to match one object partially matches another
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
