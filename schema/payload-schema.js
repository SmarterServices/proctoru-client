'use strict';

const joi = require('joi');
const utils = require('./../lib/helpers/utils');

const schema = {
  getStudentReservationList: joi
  .object({
    studentId: joi
      .number()
      .integer()
      .required()
      .description('Institution\'s unique test-taker ID')
  })
    .required()
    .description('Get student reservation list schema'),
  beginReservation: joi
    .object({
      studentId: joi
        .number()
        .integer()
        .required()
        .description('Institution\'s unique test-taker ID'),
      reservationId: joi
        .number()
        .integer()
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
        .number()
        .integer()
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
        .number()
        .integer()
        .required()
        .description('Test-taker\'s zip or postal code'),
      phone1: joi
        .number()
        .integer()
        .required()
        .description('Test-taker\'s Primary Telephone Number'),
      phone2: joi
        .number()
        .integer()
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
        .required()
        .description('Total time allowed for the exam in minutes'),
      notes: joi
        .string()
        .description('Notes that only the proctors / ProctorU can view'),
      startDate: joi
        .string()
        .isoDate()
        .regex(/.*Z/, 'ISO time format in utc zone')
        .example(utils.dateTemplate(), 'date template')
        .required()
        .description('Date the reservation will be available'),
      reservationId: joi
        .number()
        .integer()
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
        .allow('Y','N')
        .description('Whether to notify the test-taker of this scheduling by e-mail. Defaults to true if omitted.'),
      urlReturn: joi
        .string()
        .uri()
        .description('URL to redirect the test-taker to after scheduling'),
      notify: joi
        .string()
        .allow('Y','N')
        .description('notify'),
      examUrl: joi
        .string()
        .uri()
        .description('URL where the exam is located'),
      examPassword: joi
        .string()
        .description('Password for the exam')
    })
    .required()
    .description('add adhoc process payload')
};

module.exports = schema;
