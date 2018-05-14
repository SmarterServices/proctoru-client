'use strict';
const nock = require('nock');
const proctorUData = require('./../data/mock');
const PROCTORU_HOST = proctorUData.config.host;
const apiList = require('./../../data/api-list');

const ProctorUMocker = {
  activeMocks: [],

  /**
   * Mocker for getTimeZone List
   * @param shouldFail
   * @returns {*}
   */
  getTimeZoneList: function (responseType = 'valid') {
    let scope = nock(PROCTORU_HOST)
      .persist()
      .get(apiList.getTimeZoneList.endpoint)
      .query(true)
      .reply(function () {
          return [200, proctorUData.getTimeZoneList.response[responseType]];
      });
    this.activeMocks.push(scope);
    return scope;
  },

  reset: nock.cleanAll,

  /**
   * Removes All interceptor
   */
  removeInterceptor: function removeInterceptor() {
    this.activeMocks.forEach(scope => {
      scope.interceptors.forEach(interceptor => nock.removeInterceptor(interceptor));
    });
    this.activeMocks = [];
  }
};

module.exports = ProctorUMocker;
