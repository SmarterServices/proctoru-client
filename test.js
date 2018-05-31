'use strict';

const Client = require('./index');

const client = new Client({
  host: 'https://demo.proctoru.com/api',
  authorizationToken: '30846d01-41be-4183-be85-4665f955afe1'
});

client
  // .getTimeZoneList()
  // .getStudentReservationList({studentId: '269'})
  // .beginReservation({
  //   studentId: '269',
  //   reservationId: '9322'
  // })
  //  .getScheduleInfoAvailableTimesList({
  //   studentId: '269',
  //  timeZoneId: '42',
  //  examId: '940',
  //  isadhoc: 'Y',
  //  startDate: '2018-08-29T00:00:00Z',
  //  takeitnow: 'N',
  //  duration: 60
  // })
  // .addAdHocProcess(
  //   {
  //     studentId: '269',
  //     lastName: 'Skywalker',
  //     firstName: 'Luke',
  //     address1: '5858 Lucas Valley Rd',
  //     city: 'Nicasio',
  //     state: 'CA',
  //     country: 'US',
  //     zipcode: 94946,
  //     phone1: 926763264,
  //     email: 'lucas_skywalker@starwars.com',
  //     takeitnow: 'N',
  //     timeZoneId: 'Tonga Standard Time',
  //     description: 'Lightsaber Swordsmanship',
  //     duration: 60,
  //     startDate: '2019-02-16T11:00:00Z',
  //     reservationId: '1011'
  //   }
  // )
  // .removeReservation({
  //   studentId: '269',
  //   reservationNo: 907886907
  // })
  // .moveReservation({
  //   reservationNo: 907886639,
  //   startDate: '2019-08-29T00:00:00Z',
  //   reservationId: 1321
  // })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
