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

    it('Should fail for invalid [reservationNo]', () => {

      const errorType = 'reservationNotFoundError';

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

    it('Should fail for invalid [reservationNo]', () => {

      const errorType = 'reservationCancelledError';

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
