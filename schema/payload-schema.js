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
    .description('Get student reservation list schema')
};

module.exports = schema;
