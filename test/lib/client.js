'use strict';

const Client = require('./../../index');
const mockData = require('./../data/mock.json');
const expect = require('chai').expect;

describe('Client', function testClient() {
  const config = mockData.config ;
  let client;

  it('Should create new client', function testCreateNewClient() {
    client = new Client(config);
    expect(client).instanceof(Client);
  });
});
