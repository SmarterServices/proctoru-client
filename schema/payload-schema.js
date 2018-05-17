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
  getScheduleInfoAvailableTimesList: joi
    .object({
      studentId: joi
        .number()
        .integer()
        .required()
        .description('Institution\'s unique test-taker ID'),
      timeZoneId: joi
        .number()
        .integer()
        .required()
        .description('Time Zone ID - please call getTimeZoneList for a list of IDs'),
      isadhoc: joi
        .string()
        .allow('Y','N')
        .description('Specifies whether the request is for an addAdHoc request'),
      examId: joi
        .number()
        .integer()
        .required()
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
        .allow('Y','N')
        .required()
        .description('Date for the times that you would like to see'),
      reservationNo: joi
        .number()
        .integer()
        .description('Used to edit a previous appointment.'),
      duration: joi
        .number()
        .integer()
        .required()
        .description('Length of the exam in minutes'),

    })
    .required()
    .description('get schedule info available times list schema')
};

module.exports = schema;
