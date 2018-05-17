'use strict';

const nock = require('nock');
const Client = require('./../../index');
const mockData = require('./../data/mock.json');
const expect = require('chai').expect;
const proctorUMock = require('./mock');

describe('Client', function testClient() {
  const config = mockData.config ;
  let client;

  before('Mock', function () {
    nock.disableNetConnect();
  });

  after('Mock', function () {
    nock.enableNetConnect();
    proctorUMock.reset();
  });

  it('Should create new client', function testCreateNewClient() {
    client = new Client(config);
    expect(client).instanceof(Client);
  });

  describe('Get TimeZone List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getTimeZoneList');
    });

    it('Should list timeZone', () => {
      return client
        .getTimeZoneList()
        .then((response)=>{
          expect(response).to.eql(mockData.getTimeZoneList.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getTimeZoneList', 'timeOutError');

      return client
        .getTimeZoneList()
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getTimeZoneList.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.getTimeZoneList.response.timeOutError.message);
        });
    });
  });

  describe('Get Student Reservation List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getStudentReservationList');
    });

    const payload = mockData.getStudentReservationList.params;

    it('Should list studentReservation', () => {
      return client
        .getStudentReservationList(payload)
        .then((response)=>{
          expect(response).to.eql(mockData.getStudentReservationList.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getStudentReservationList', 'timeOutError');

      return client
        .getStudentReservationList(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getStudentReservationList.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.getStudentReservationList.response.timeOutError.message);
        });
    });

    it('Should fail for missing [studentId]', () => {

      return client
        .getStudentReservationList({})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for invalid [studentId]', () => {

      const errorType = 'studentNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getStudentReservationList', errorType);

      return client
        .getStudentReservationList(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getStudentReservationList.response[errorType].response_code);
          expect(error.message).to.eql(mockData.getStudentReservationList.response[errorType].message);
        });
    });
  });
  describe('Begin Reservation', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('beginReservation');
    });

    const payload = mockData.beginReservation.params;

    it('Begin reservation', () => {
      return client
        .beginReservation(payload)
        .then((response)=>{
          expect(response).to.eql(mockData.beginReservation.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('beginReservation', 'timeOutError');

      return client
        .beginReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.beginReservation.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.beginReservation.response.timeOutError.message);
        });
    });

    it('Should fail for missing [studentId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.studentId;

      return client
        .beginReservation({})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for missing [reservationId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.reservationId;

      return client
        .beginReservation({})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for invalid [studentId]', () => {

      const errorType = 'studentNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('beginReservation', errorType);

      return client
        .beginReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.beginReservation.response[errorType].response_code);
          expect(error.message).to.eql(mockData.beginReservation.response[errorType].message);
        });
    });

    it('Should fail for invalid [reservationId]', () => {

      const errorType = 'reservationInFutureError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('beginReservation', errorType);

      return client
        .beginReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.beginReservation.response[errorType].response_code);
          expect(error.message).to.eql(mockData.beginReservation.response[errorType].message);
        });
    });
  });

  describe('Get Schedule Info Available Times List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getScheduleInfoAvailableTimesList');
    });

    const payload = mockData.getScheduleInfoAvailableTimesList.params;

    it('Should list schedule info available times list', () => {
      return client
        .getScheduleInfoAvailableTimesList(payload)
        .then((response)=>{
          expect(response).to.eql(mockData.getScheduleInfoAvailableTimesList.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getScheduleInfoAvailableTimesList', 'timeOutError');

      return client
        .getScheduleInfoAvailableTimesList(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getScheduleInfoAvailableTimesList.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.getScheduleInfoAvailableTimesList.response.timeOutError.message);
        });
    });

    it('Should fail for missing [studentId]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.studentId;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for missing [timeZoneId]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.timeZoneId;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"timeZoneId" is required');
        });
    });

    it('Should fail for missing [examId]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.examId;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"examId" is required');
        });
    });

    it('Should fail for missing [startDate]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.startDate;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"startDate" is required');
        });
    });

    it('Should fail for missing [takeitnow]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.takeitnow;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"takeitnow" is required');
        });
    });

    it('Should fail for missing [duration]', () => {

      const customPayload = Object.assign({},payload);
      delete customPayload.duration;

      return client
        .getScheduleInfoAvailableTimesList(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"duration" is required');
        });
    });

    it('Should fail for invalid [studentId]', () => {

      const errorType = 'studentNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getScheduleInfoAvailableTimesList', errorType);

      return client
        .getScheduleInfoAvailableTimesList(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType].response_code);
          expect(error.message).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType].message);
        });
    });

    it('Should fail for invalid [examId]', () => {

      const errorType = 'examNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.getEndpointMocker('getScheduleInfoAvailableTimesList', errorType);

      return client
        .getScheduleInfoAvailableTimesList(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType].response_code);
          expect(error.message).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType].message);
        });
    });
  });

  describe('Add AdHoc Process', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('addAdHocProcess');
    });

    const payload = mockData.addAdHocProcess.params;

    it('Begin reservation', () => {
      return client
        .addAdHocProcess(payload)
        .then((response)=>{
          expect(response).to.eql(mockData.addAdHocProcess.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', 'timeOutError');

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response.timeOutError.message);
        });
    });

    it('Should fail for missing [studentId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.studentId;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for missing [lastName]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.lastName;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"lastName" is required');
        });
    });

    it('Should fail for missing [firstName]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.firstName;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"firstName" is required');
        });
    });

    it('Should fail for missing [address1]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.address1;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"address1" is required');
        });
    });

    it('Should fail for missing [city]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.city;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"city" is required');
        });
    });

    it('Should fail for missing [state]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.state;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"state" is required');
        });
    });

    it('Should fail for missing [country]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.country;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"country" is required');
        });
    });

    it('Should fail for missing [zipcode]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.zipcode;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"zipcode" is required');
        });
    });

    it('Should fail for missing [phone1]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.phone1;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"phone1" is required');
        });
    });

    it('Should fail for missing [email]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.email;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"email" is required');
        });
    });

    it('Should fail for missing [timeZoneId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.timeZoneId;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"timeZoneId" is required');
        });
    });


    it('Should fail for missing [description]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.description;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"description" is required');
        });
    });

    it('Should fail for missing [duration]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.duration;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"duration" is required');
        });
    });

    it('Should fail for missing [startDate]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.startDate;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"startDate" is required');
        });
    });

    it('Should fail for missing [reservationId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.reservationId;

      return client
        .addAdHocProcess(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"reservationId" is required');
        });
    });

    it('Should fail for invalid [studentId]', () => {

      const errorType = 'studentNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', errorType);

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response[errorType].response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response[errorType].message);
        });
    });

    it('Should fail for invalid [reservationId]', () => {

      const errorType = 'reservationIdExistError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', errorType);

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response[errorType].response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response[errorType].message);
        });
    });

    it('Should fail for overlapping exams', () => {

      const errorType = 'overlapError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', errorType);

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response[errorType].response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response[errorType].message);
        });
    });

    it('Should fail for invalid [timeZoneId]', () => {

      const errorType = 'timeZoneNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', errorType);

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response[errorType].response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response[errorType].message);
        });
    });

    it('Should fail for invalid [startDate]', () => {

      const errorType = 'startDateInPastError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('addAdHocProcess', errorType);

      return client
        .addAdHocProcess(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.addAdHocProcess.response[errorType].response_code);
          expect(error.message).to.eql(mockData.addAdHocProcess.response[errorType].message);
        });
    });

  });

  describe('Remove Reservation', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('removeReservation');
    });

    const payload = mockData.removeReservation.params;

    it('Remove reservation', () => {
      return client
        .removeReservation(payload)
        .then((response)=>{
          expect(response).to.eql(mockData.removeReservation.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('removeReservation', 'timeOutError');

      return client
        .removeReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.removeReservation.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.removeReservation.response.timeOutError.message);
        });
    });

    it('Should fail for missing [studentId]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.studentId;

      return client
        .removeReservation(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"studentId" is required');
        });
    });

    it('Should fail for missing [reservationNo]', () => {

      const customPayload = Object.assign({}, payload);
      delete customPayload.reservationNo;

      return client
        .removeReservation(customPayload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql('"reservationNo" is required');
        });
    });

    it('Should fail for invalid [studentId]', () => {

      const errorType = 'studentNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('removeReservation', errorType);

      return client
        .removeReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.removeReservation.response[errorType].response_code);
          expect(error.message).to.eql(mockData.removeReservation.response[errorType].message);
        });
    });

    it('Should fail for invalid [reservationNo]', () => {

      const errorType = 'reservationNotFoundError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('removeReservation', errorType);

      return client
        .removeReservation(payload)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.removeReservation.response[errorType].response_code);
          expect(error.message).to.eql(mockData.removeReservation.response[errorType].message);
        });
    });

  });

});
