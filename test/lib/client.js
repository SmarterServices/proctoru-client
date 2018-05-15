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


});
