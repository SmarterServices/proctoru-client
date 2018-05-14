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

  before('Mock', function () {
    nock.enableNetConnect();
  });

  it('Should create new client', function testCreateNewClient() {
    client = new Client(config);
    expect(client).instanceof(Client);
  });

  describe('Get TimeZone List', function testClient() {

    before('Create Mocker', function () {
      proctorUMock.getTimeZoneList();
    });

    it('Should list timeZone', () => {
      return client
        .getTimeZoneList()
        .then((response)=>{
          expect(response).to.eql(mockData.getTimeZoneList.response.valid);
        });
    });

    it('Should fail for invalid credential', () => {

      proctorUMock.removeInterceptor();
      proctorUMock.getTimeZoneList('timeOutError');

      return client
        .getTimeZoneList()
        .then(Promise.reject)
        .catch((error)=>{
          expect(error.response_code).to.eql(mockData.getTimeZoneList.response.timeOutError.response_code);
          expect(error.message).to.eql(mockData.getTimeZoneList.response.timeOutError.message);
        });
    });
  });


});
