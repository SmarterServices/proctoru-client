'use strict';

const joi = require('joi');
const utils = require('./../lib/helpers/utils');

const schema = {
  credential: joi
    .object({
      host: joi
        .string()
        .required()
        .description('Host url'),
      authorizationToken: joi
        .string()
        .required()
        .description('Access Token')
    })
    .required()
    .description('credential schema'),
  getStudentReservationList: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID')
    })
    .required()
    .description('Get student reservation list schema'),
  beginReservation: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID'),
      reservationId: joi
        .string()
        .required()
        .description('Institution\'s unique reservation ID'),
      reservationNo: joi
        .number()
        .integer()
        .description('ProctorU\'s unique reservation number')
    })
    .required()
    .description('begin Reservation payload'),
  addAdHocProcess: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID'),
      lastName: joi
        .string()
        .required()
        .description('Test-taker\'s last name'),
      firstName: joi
        .string()
        .required()
        .description('Test-taker\'s first name'),
      address1: joi
        .string()
        .required()
        .description('Test-taker\'s Address 1 *required if US only'),
      address2: joi
        .string()
        .description('Test-taker\'s Address 2'),
      city: joi
        .string()
        .required()
        .description('Test-taker\'s City *required if US only'),
      state: joi
        .string()
        .required()
        .description('Test-taker\'s State *required if US only'),
      country: joi
        .string()
        .required()
        .description('Test-taker\'s Country'),
      zipcode: joi
        .string()
        .required()
        .description('Test-taker\'s zip or postal code'),
      phone1: joi
        .string()
        .required()
        .description('Test-taker\'s Primary Telephone Number'),
      phone2: joi
        .string()
        .description('Test-taker\'s Secondary Telephone Number'),
      email: joi
        .string()
        .email()
        .required()
        .description('Test-taker\'s Email'),
      timeZoneId: joi
        .string()
        .required()
        .description('Time Zone ID - please call getTimeZoneList for a list of IDs'),
      description: joi
        .string()
        .required()
        .description('Title of the exam'),
      duration: joi
        .number()
        .integer()
        .positive()
        .required()
        .description('Total time allowed for the exam in minutes'),
      notes: joi
        .string()
        .allow(null, '')
        .description('Notes that only the proctors / ProctorU can view'),
      startDate: joi
        .string()
        .isoDate()
        .regex(/.*Z/, 'ISO time format in utc zone')
        .example(utils.dateTemplate(), 'date template')
        .required()
        .description('Date the reservation will be available'),
      reservationId: joi
        .string()
        .required()
        .description('Institution\'s unique reservation ID'),
      reservationNo: joi
        .number()
        .integer()
        .description('ProctorU\'s unique reservation ID'),
      comments: joi
        .string()
        .description('Comments input by the test-taker'),
      takeitnow: joi
        .string()
        .default('Y')
        .allow('Y', 'N')
        .description('Whether to notify the test-taker of this scheduling by e-mail. Defaults to true if omitted.'),
      urlReturn: joi
        .string()
        .uri()
        .description('URL to redirect the test-taker to after scheduling'),
      notify: joi
        .string()
        .allow('Y', 'N')
        .description('notify'),
      examUrl: joi
        .string()
        .uri()
        .description('URL where the exam is located'),
      examPassword: joi
        .string()
        .description('Password for the exam'),
      instructors: joi
        .array()
        .items(joi
          .object({
            firstName: joi
              .string()
              .required()
              .description('Instructor\'s first name'),
            lastName: joi
              .string()
              .required()
              .description('Instructor\'s last name'),
            email: joi
              .string()
              .email()
              .required()
              .description('Email of the instructor')
          })
          .required()
          .description('Instructor information')
        )
        .description('List of instructor'),
      departmentId: joi
        .string()
        .description('Department ID'),
      whitelistUrls: joi
          .array()
          .description('Array of urls to whitelist for exam attachments')
    })
    .description('add adhoc process payload'),
  getScheduleInfoAvailableTimesList: joi
    .object({
      studentId: joi
        .string()
        .description('Institution\'s unique test-taker ID'),
      timeZoneId: joi
        .string()
        .required()
        .description('Time Zone ID - please call getTimeZoneList for a list of IDs'),
      isadhoc: joi
        .string()
        .allow('Y', 'N')
        .description('Specifies whether the request is for an addAdHoc request'),
      examId: joi
        .string()
        .description('Institution\'s unique exam ID. Pass this back in order to update the exam.'),
      startDate: joi
        .string()
        .isoDate()
        .regex(/.*Z/, 'ISO time format in utc zone')
        .example(utils.dateTemplate(), 'date template')
        .required()
        .description('Date for the times that you would like to see'),
      takeitnow: joi
        .string()
        .allow('Y', 'N')
        .required()
        .description('Date for the times that you would like to see'),
      reservationNo: joi
        .number()
        .integer()
        .description('Used to edit a previous appointment.'),
      duration: joi
        .number()
        .integer()
        .positive()
        .required()
        .description('Length of the exam in minutes'),

    })
    .required()
    .description('get schedule info available times list schema'),
  removeReservation: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID'),
      reservationNo: joi
        .number()
        .integer()
        .required()
        .description('ProctorU\'s unique reservation ID'),
      explanation: joi
        .string()
        .description('explanation')
    })
    .required()
    .description('remove reservation payload'),
  moveReservation: joi
    .object({
      reservationNo: joi
        .number()
        .integer()
        .required()
        .description('ProctorU unique reservation ID'),
      startDate: joi
        .string()
        .isoDate()
        .regex(/.*Z/, 'ISO time format in utc zone')
        .example(utils.dateTemplate(), 'date template')
        .required()
        .description('Date the reservation will be available'),
      reservationId: joi
        .string()
        .required()
        .description('Institution\'s unique reservation ID'),
      urlReturn: joi
        .string()
        .uri()
        .description('URL to redirect the test-taker to after scheduling'),
      notify: joi
        .string()
        .default('Y')
        .allow('Y', 'N')
        .description('notify')
    })
    .required()
    .description('move reservation payload'),
  clientActivityReport: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID')
    })
    .required()
    .description('begin Reservation payload'),
  getAppointmentDetails: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID')
    })
    .required()
    .description('begin Reservation payload'),
  autoLogin: joi
    .object({
      studentId: joi
        .string()
        .required()
        .description('Institution\'s unique test-taker ID'),
      email: joi
        .string()
        .email()
        .required()
        .description('Test-taker\'s Email'),
      firstName: joi
        .string()
        .required()
        .description('Test-taker\'s first name'),
      lastName: joi
        .string()
        .required()
        .description('Test-taker\'s last name'),
      timeZoneId: joi
        .string()
        .required()
        .description('Time Zone ID - please call getTimeZoneList for a list of IDs'),
      urlReturn: joi
        .string()
        .uri()
        .description('URL to redirect the test-taker to after scheduling'),
      update: joi
        .number()
        .min(0)
        .max(1)
        .description('Update the test taker\'s record with supplied values'),

    })
    .required()
    .description('begin Reservation payload'),
  editInstitutionalUser: joi
    .object({
      userPassword: joi
        .string()
        .description('Institutional-user\'s unique password'),
      lastName: joi
        .string()
        .required()
        .description('Institutional-user\'s last name'),
      firstName: joi
        .string()
        .required()
        .description('Institutional-user\'s first name'),
      address1: joi
        .string()
        .required()
        .description('Institutional-user\'s Address 1 '),
      city: joi
        .string()
        .required()
        .description('Institutional-user\'s City *required if US only'),
      state: joi
        .string()
        .required()
        .description('Institutional-user\'s State *required if US only'),
      country: joi
        .string()
        .required()
        .description('Institutional-user\'s Country'),
      zipcode: joi
        .string()
        .required()
        .description('Institutional-user\'s zip or postal code'),
      phone1: joi
        .string()
        .required()
        .description('Institutional-user\'s Primary Telephone Number'),
      email: joi
        .string()
        .required()
        .description('Institutional-user\'s Email'),
      timeZoneId: joi
        .string()
        .required()
        .description('Time Zone ID of Institutional user'),
      role: joi
        .string()
        .required()
        .valid('administrator', 'instructor')
        .description('The role of the institutional user')
    })
    .required()
    .description('Edit institutional user payload')
};

module.exports = schema;
