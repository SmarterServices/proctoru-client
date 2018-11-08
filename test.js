'use strict';
const _ = require('lodash');
const Client = require('./index');
const credential = {
  host: '',
  authorizationToken: ''
};
const client = new Client();

//client
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

  client.addAdHocProcess(
    Object.assign({
      studentId: '270',
      lastName: 'Skywalker',
      firstName: 'Luke',
      address1: '5858 Lucas Valley Rd',
      city: 'Nicasio',
      state: 'CA',
      country: 'US',
      zipcode: '94946',
      phone1: '926763264',
      email: 'lucas_skywalker@starwars.com',
      takeitnow: 'N',
      timeZoneId: 'Tonga Standard Time',
      description: 'Lightsaber Swordsmanship',
      duration: 60,
      startDate: '2019-08-19T11:00:00Z',
      reservationId: '2000',
      instructors: [
        {
          firstName: 'Course',
          lastName: 'Instructor',
          email: 'CU123456789@course.smarterproctoring.com'
        }
      ]
    }, credential)
  )

//   .removeReservation(Object.assign({
//     studentId: '270',
//     reservationNo: 907887045
//   }, credential))
  // .moveReservation(Object.assign({
  //   reservationNo: 907887045,
  //   startDate: '2019-08-29T00:00:00Z',
  //   reservationId: '1011'
  // },credential))
  // .autoLogin(Object.assign({
  //   studentId: '269',
  //   email: 'lucas_skywalker@starwars.com',
  //   firstName: 'Luke',
  //   lastName: 'Skywalker',
  //   timeZoneId: 'Central Standard Time',
  //   urlReturn: 'http://www.starwars.com',
  //   update: 1
  // }, credential))
  //.getOAuthToken(credential)
  // .getReservationDetails(Object.assign({}, credential, {studentId: 'US114232bdc7dd43fd9eedd57548f17c59' }), 8010833)
  //.getpendingExamReportByStudent(Object.assign({}, credential, {studentId: 'US114232bdc7dd43fd9eedd57548f17c59'}))
/*
  client.editInstitutionalUser(Object.assign({}, credential, {
   userPassword: 'password',
     firstName: 'Course',
     lastName: 'Instructor',
     address1: '5858 Lucas Valley Rd',
     city: 'Nicasio',
     state: 'CA',
     country: 'US',
     zipcode: '94946',
     phone1: '926763264',
     email: 'CU123456789@course.smarterproctoring.com',
     timeZoneId: 'Canada Central Standard Time',
     role: 'instructor'
  }))
  */
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
