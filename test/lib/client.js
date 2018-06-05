'use strict';

const nock = require('nock');
const camelize = require('camelize');
const Client = require('./../../index');
let mockData = require('./../data/mock.json');
const expect = require('chai').expect;
const proctorUMock = require('./mock');

describe('Client', function testClient() {
  const config = mockData.config ;
  let client;

  before('Mock', function () {
    nock.disableNetConnect();
    mockData = camelize(mockData);
  });

  after('Mock', function () {
    nock.enableNetConnect();
    proctorUMock.reset();
  });

  it('Should create new client', function testCreateNewClient() {
    client = new Client();
    expect(client).instanceof(Client);
  });

  describe('Get TimeZone List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getTimeZoneList');
    });

    it('Should list timeZone', () => {
      return client
        .getTimeZoneList(config)
        .then((response)=>{
          expect(response).to.eql(mockData.getTimeZoneList.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor(config);
      proctorUMock.getEndpointMocker('getTimeZoneList', 'timeOutError');

      return client
        .getTimeZoneList(config)
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql(mockData.getTimeZoneList.response.timeOutError);
        });
    });
  });

  describe('Get Student Reservation List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getStudentReservationList');
    });

    const payload = Object.assign(mockData.getStudentReservationList.params, config);

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
          expect(error).to.eql(mockData.getStudentReservationList.response.timeOutError);
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
          expect(error).to.eql(mockData.getStudentReservationList.response[errorType]);
        });
    });
  });

  describe('Begin Reservation', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('beginReservation');
    });

    const payload = Object.assign(mockData.beginReservation.params, config);

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
          expect(error).to.eql(mockData.beginReservation.response.timeOutError);
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
          expect(error).to.eql(mockData.beginReservation.response[errorType]);
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
          expect(error).to.eql(mockData.beginReservation.response[errorType]);
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
          expect(error).to.eql(mockData.beginReservation.response[errorType]);
        });
    });

  });

  describe('Get Schedule Info Available Times List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getEndpointMocker('getScheduleInfoAvailableTimesList');
    });

    const payload = Object.assign(mockData.getScheduleInfoAvailableTimesList.params, config);

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
          expect(error).to.eql(mockData.getScheduleInfoAvailableTimesList.response.timeOutError);
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
          expect(error).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType]);
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
          expect(error).to.eql(mockData.getScheduleInfoAvailableTimesList.response[errorType]);
        });
    });
  });

  describe('Add AdHoc Process', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('addAdHocProcess');
    });

    const payload = Object.assign(mockData.addAdHocProcess.params, config);

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
          expect(error).to.eql(mockData.addAdHocProcess.response.timeOutError);
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
          expect(error).to.eql(mockData.addAdHocProcess.response[errorType]);
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
          expect(error).to.eql(mockData.addAdHocProcess.response[errorType]);
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
          expect(error).to.eql(mockData.addAdHocProcess.response[errorType]);
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
          expect(error).to.eql(mockData.addAdHocProcess.response[errorType]);
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
          expect(error).to.eql(mockData.addAdHocProcess.response[errorType]);
        });
    });

  });

  describe('Remove Reservation', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('removeReservation');
    });

    const payload = Object.assign(mockData.removeReservation.params, config);

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
          expect(error).to.eql(mockData.removeReservation.response.timeOutError);
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
          expect(error).to.eql(mockData.removeReservation.response[errorType]);
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
          expect(error).to.eql(mockData.removeReservation.response[errorType]);
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
          expect(error).to.eql(mockData.removeReservation.response[errorType]);
        });
    });

  });

  describe('Move Reservation', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.postEndpointMocker('moveReservation');
    });

    const payload = Object.assign(mockData.moveReservation.params, config);

    it('Move reservation successfully', () => {
      return client
        .moveReservation(payload, {})
        .then((response)=>{
          expect(response).to.eql(mockData.moveReservation.response.valid);
        });
    });

    it('Should fail for invalid [timeSent]', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('moveReservation', 'timeOutError');

      return client
        .moveReservation(payload, {})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql(mockData.moveReservation.response.timeOutError);
        });
    });

    it('Should fail for already deleted reservation', () => {

      const errorType = 'reservationCancelledError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('moveReservation', errorType);

      return client
        .moveReservation(payload, {})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql(mockData.moveReservation.response[errorType]);
        });
    });

    it('Should fail for invalid [reservationId]', () => {

      const errorType = 'reservationNotForInstitutionError';

      proctorUMock.removeInterceptor();
      proctorUMock.postEndpointMocker('moveReservation', errorType);

      return client
        .moveReservation(payload, {})
        .then(Promise.reject)
        .catch((error)=>{
          expect(error).to.eql(mockData.moveReservation.response[errorType]);
        });
    });

  });

});
