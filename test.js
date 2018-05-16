'use strict';

const Client = require('./index');

const client = new Client({
  host: 'https://demo.proctoru.com/api',
  authorizationToken: '30846d01-41be-4183-be85-4665f955afe1'
});

client
  //.getTimeZoneList()
  // .getStudentReservationList({studentId: 269})
  // .beginReservation({
  //   studentId: 269,
  //   reservationId: 932
  // })
  .addAdHocProcess({
    studentId: 269,
    lastName: 'Skywalker',
    firstName: 'Luke',
    address1: '5858 Lucas Valley Rd',
    city: 'Nicasio',
    state: 'CA',
    country: 'US',
    zipcode: 94946,
    phone1: 926763264,
    email: 'lucas_skywalker@starwars.com',
    takeitnow: 'N',
    timeZoneId: 'Tonga Standard Time',
    description: 'Lightsaber Swordsmanship',
    duration: 60,
    startDate: '2018-08-16T11:00:00Z',
    reservationId: 9321
  })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
