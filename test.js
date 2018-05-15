'use strict';

const Client = require('./index');

const client = new Client({
  host: 'https://demo.proctoru.com/api',
  authorizationToken: '30846d01-41be-4183-be85-4665f955afe1'
});

client
  // .getTimeZoneList()
  // .getStudentReservationList({studentId: 269})
  .beginReservation({
    studentId: 269,
    reservationId: 932
  })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
