'use strict';

const joi = require('joi');

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
    .description('begin Reservation payload')
};

module.exports = schema;
