'use strict';

const Client = require('./index');
const credential = {
  host: 'https://demo.proctoru.com/api',
  authorizationToken: '30846d01-41be-4183-be85-4665f955afe1'
};
const client = new Client();

client
// .getTimeZoneList(credential)
// .getStudentReservationList(Object.assign({}, credential, {studentId: '270'}))
//   .beginReservation(Object.assign({
//     studentId: '270',
//     reservationId: '1011',
//     reservationNo: 907887045
//   }, credential))
//   .getScheduleInfoAvailableTimesList(Object.assign({
//     studentId: '270',
//     timeZoneId: '42',
//     examId: '940',
//     isadhoc: 'Y',
//     startDate: '2018-08-29T00:00:00Z',
//     takeitnow: 'N',
//     duration: 60
//   }, credential))
//   .addAdHocProcess(
//     Object.assign({
//       studentId: '270',
//       lastName: 'Skywalker',
//       firstName: 'Luke',
//       address1: '5858 Lucas Valley Rd',
//       city: 'Nicasio',
//       state: 'CA',
//       country: 'US',
//       zipcode: 94946,
//       phone1: 926763264,
//       email: 'lucas_skywalker@starwars.com',
//       takeitnow: 'N',
//       timeZoneId: 'Tonga Standard Time',
//       description: 'Lightsaber Swordsmanship',
//       duration: 60,
//       startDate: '2019-02-16T11:00:00Z',
//       reservationId: '1011'
//     }, credential)
//   )
  .removeReservation(Object.assign({
    studentId: '270',
    reservationNo: 907887045
  }, credential))
  // .moveReservation(Object.assign({
  //   reservationNo: 907887045,
  //   startDate: '2019-08-29T00:00:00Z',
  //   reservationId: '1011'
  // },credential))
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
