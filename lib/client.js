'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const payloadSchema = require('../schema/payload-schema');
const utils = require('./helpers/utils');
const whiteList = require('./../config/white-list.json');

class Client {
  /**
   * Configure the client
   * @param {Object} config - Config object
   * @param {Object} config._authorizationToken - token to use as header
   * @param {Object} config.host - host url to request
   */
  constructor(config) {
    this._authorizationToken = config.authorizationToken;
    this._host = this._sanitizeHost(config.host);
    this.SUCCESS_CODE = 1;
  }

  /**
   * Modifies host string to remove unnecessary part
   * @param {String} host - host name to request
   * @returns {String} modifiedHost - host name after sanitizing
   * @private
   */
  _sanitizeHost(host) {
    let modifiedHost = host;
    if (host.endsWith('/')){
      //if host ends with a slash,
      //drop that since there is one in apiList
      modifiedHost = host.slice(0, host.length - 1);
    }
    return modifiedHost;
  }

  /**
   * Set method and endpoint to instance
   * @param {string} method - HTTP method
   * @param {string} url - url to request for
   * @return {Object<Client>}
   * @memberof Client
   */
  _setMethodAndEndpoint(method, url) {
    this._method = method;
    this._url = url;
    return this;
  }

  /**
   * @param {string} endpoint - url of the endpoint to request
   * @returns {Object<Client}
   * @memberof Client
   */
  _get(endpoint) {
    return this._setMethodAndEndpoint('GET', endpoint);
  }

  /**
   * @param {string} endpoint - url of the endpoint to request
   * @returns {Object<Client}
   * @memberof Client
   */
  _post(endpoint) {
    return this._setMethodAndEndpoint('POST', endpoint);
  }

  /**
   * @param {String} endpoint - url of the endpoint to request
   * @returns {Object<Client}
   * @memberof Client
   */
  _put(endpoint) {
    return this._setMethodAndEndpoint('PUT', endpoint);
  }

  /**
   * @param {string} endpoint - url of the endpoint to request
   * @returns {Object<Client}
   * @memberof Client
   */
  _delete(endpoint) {
    return this._setMethodAndEndpoint('DELETE', endpoint);
  }

  /**
   * Set the payload to send
   * @param {Object} payload
   * @return {Object<Client>}
   * @memberof Client
   */
  _send(payload) {
    this._payload = payload;
    return this;
  }

  /**
   * Send the actual request with set method, url and payload
   * @return {Promise}
   * @memberof Client
   */
  _end() {

    const requestOptions = {
      url: this._url,
      method: this._method,
      json: true,
      form: this._payload,
      headers: {
        'Authorization-Token': this._authorizationToken
      },
      resolveWithFullResponse: false
    };

    return requestPromise(requestOptions)
      .then((response)=>{
        if (response.response_code !== this.SUCCESS_CODE) {
          //if any error has occured
          return Promise.reject(response);
        }

        return Promise.resolve(response);
      });
  }

  /**
   * Create url for request
   * @param {String} endpointName - name of the endpoint
   * @param {Object} [params] - param values
   * @param {Object} [query] - query values
   * @memberof Client
   */
  _getUrl(endpointName, params={}, query) {
    const urlTemplate = this._host + apiList[endpointName].endpoint;
    const method = apiList[endpointName].method;

    let queryParams;
    if (method === 'GET') {
      //current timeStamp is expected as query params for GET endpoint
      queryParams = {
        time_sent: new Date().toISOString()
      };
      queryParams = _.merge(queryParams, query);
    }

    const url = utils.buildUrl(urlTemplate, params, queryParams);
    return url;
  }

  /**
   * Validates request payload against joi schema
   * @param {String} methodName - Request method name
   * @param {Object} payload - Request payload
   * @returns {Promise}
   * @private
   */
  _validateData(methodName, payload) {
    let schema = payloadSchema[methodName];

    return new Promise(function (resolve, reject) {
      joi.validate(payload, schema, function (error, data) {
        if (error) {
          return reject(_.get(error, 'details[0].message'));
        }
        resolve();
      });
    });

  }

  /**
   * Converts a camelCase object into snakeCase object
   * @param {Object} payload - the camelCase payload to convert
   * @private
   */
  _convertToSnakeCase(payload) {
    const list = whiteList.list;
    const snakeCasePayload = _.mapKeys(payload, function(value, key) {
      if(list.includes(key)) {
        return key;
      } else {
        return _.snakeCase(key);
      }
    });
    return snakeCasePayload;
  }

  /**
   * Returns list of TimeZones
   * @returns {Promise}
   */
  getTimeZoneList() {

    const url = this._getUrl('getTimeZoneList');

    return this
      ._get(url)
      ._end();
  }

  /**
   * Returns required url and queryParams of get endpoint
   * @param {Object} queryParams - params that should be converted to camel case
   * @param {String} methodName  - name of the method to get the url
   * @returns {Promise}
   */
  _getParamsAndUrl(queryParams, methodName) {
    queryParams = this._convertToSnakeCase(queryParams);
    const url = this._getUrl(methodName, {}, queryParams);
    return Promise.resolve({url, queryParams});
  }

  /**
   * Returns  list of active reservations for a single test-taker
   * @params {Object} queryParams- params to request with
   * @params {Number} queryParams.studentId - Institution's unique test-taker ID
   * @returns {Promise}
   */
  getStudentReservationList(queryParams) {
    const methodName = 'getStudentReservationList';

    return this
      ._validateData(methodName, queryParams)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._getParamsAndUrl(queryParams, methodName);
      })
      .then((response) => {
        return this._get(response.url)._end();
      });
  }

  /**
   * Returns  list of active reservations for a single test-taker
   * @params {Object} queryParams- params to request with
   * @params {Number} queryParams.studentId- Institution's unique test-taker ID
   * @params {String} queryParams.timeZoneId- Time Zone ID - please call getTimeZoneList for a list of IDs
   * @params {Number} queryParams.examId- Institution's unique exam ID. Pass this back in order to update the exam
   * @params {String} queryParams.startDate- Date for the times that you would like to see, ISO time format in utc zone
   * @params {String} [queryParams.takeitnow]- If this flag is true and the record is uploaded successfully, the student will be sent an email containing the URL, their user_id, user_password, and login instructions for ProctorU
   * @params {Number} queryParams.duration- Length of the exam in minutes
   * @params {Number} [queryParams.reservationNo]- Used to edit a previous appointment
   * @params {String} [queryParams.isadhoc]- Specifies whether the request is for an addAdHoc request
   * @returns {Promise}
   */
  getScheduleInfoAvailableTimesList(queryParams) {
    const methodName = 'getScheduleInfoAvailableTimesList';
    return this
      ._validateData(methodName, queryParams)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._getParamsAndUrl(queryParams, methodName);
      })
      .then((response) => {
        return this._get(response.url)._end();
      });
  }

  /**
   * Returns required url and payload of post endpoint
   * @param {Object} payload - payload that should be converted to camel case
   * @param {String} methodName - name of the method to search for
   * @returns {Promise}
   */
  _postPayloadAndUrl(payload, methodName) {
    payload = this._convertToSnakeCase(payload);
    const url = this._getUrl(methodName);

    payload.time_sent = new Date().toISOString();
    return Promise.resolve({payload, url});
  }

  /**
   * Retrieves a URL for a student to begin taking an exam.
   * @params {Object} payload - the payload to request with
   * @params {Number} payload.studentId - Institution's unique test-taker ID
   * @params {Number} payload.reservationId - Institution's unique reservation ID
   * @params {Number} [payload.reservationNo] - ProctorU's unique reservation number
   * @returns {Promise}
   */
  beginReservation(payload) {
    const methodName = 'beginReservation';

    return this
      ._validateData(methodName, payload)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName);
      })
      .then((response) => {
        return this
          ._post(response.url)
          ._send(response.payload)
          ._end();
      });
  }

  /**
   * Reserves a time for a test-taker to take an exam when an exam list is not being used.
   * @params {Object} payload - the payload to request with
   * @params {Number} payload.studentId - Institution's unique test-taker ID
   * @params {String} payload.lastName - Test-taker's last name
   * @params {String} payload.firstName - Test-taker's first name
   * @params {String} payload.address1 - Test-taker's Address 1 *required if US only
   * @params {String} [payload.address2] - Test-taker's Address 2
   * @params {String} payload.city - Test-taker's City *required if US only
   * @params {String} payload.state - Test-taker's State *required if US only
   * @params {String} payload.country - Test-taker's Country
   * @params {Number} payload.zipcode - Test-taker's zip or postal code
   * @params {Number} payload.phone1 - Test-taker's Primary Telephone Number
   * @params {Number} [payload.phone2] - Test-taker's Secondary Telephone Number
   * @params {String} payload.email - Test-taker's Email
   * @params {String} payload.timeZoneId - Time Zone ID - please call getTimeZoneList for a list of IDs
   * @params {String} payload.description - Title of the exam
   * @params {Number} payload.duration - Total time allowed for the exam in minutes
   * @params {String} [payload.notes] - Notes that only the proctors / ProctorU can view
   * @params {String} payload.startDate - Date the reservation will be available, ISO time format in utc zone
   * @params {Number} payload.reservationId - Institution's unique reservation ID
   * @params {Number} [payload.reservationNo] - ProctorU's unique reservation ID
   * @params {String} [payload.comments] - Comments input by the test-taker
   * @params {String} [payload.takeitnow] - If this flag is true and the record is uploaded successfully, the student will be sent an email containing the URL, their user_id, user_password, and login instructions for ProctorU
   * @params {String} [payload.urlReturn] - URL to redirect the test-taker to after scheduling
   * @params {String} [payload.notify] - Whether to notify the test-taker of this scheduling by e-mail.
   * @params {String} [payload.examUrl] - URL where the exam is located
   * @params {String} [payload.examPassword] - Password for the exam
   * @returns {Promise}
   */
  addAdHocProcess(payload) {
    const methodName = 'addAdHocProcess';

    return this
      ._validateData(methodName, payload)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName);
      })
      .then((response) => {
        return this
          ._post(response.url)
          ._send(response.payload)
          ._end();
      });
  }

  /**
   * Removes a reservation from the schedule
   * @params {Object} payload - payload to request with
   * @params {Number} payload.studentId - Institution's unique test-taker ID
   * @params {Number} payload.reservationNo - ProctorU's unique reservation ID
   * @params {String} [payload.explanation] - explanation
   * @returns {Promise}
   */
  removeReservation(payload) {
    const methodName = 'removeReservation';

    return this
      ._validateData(methodName, payload)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName);
      })
      .then((response) => {
        return this
          ._post(response.url)
          ._send(response.payload)
          ._end();
      });
  }
  /**
   * moves an existing reservation from a past date to a future date if the reservation was not used..
   * @params {Object} payload - payload to request with
   * @params {Number} payload.reservationNo - ProctorU unique reservation ID
   * @params {String} payload.startDate - Date the reservation will be available
   * @params {String} payload.startDate - Date the reservation will be available
   * @params {Number} payload.reservationId - Institution's unique reservation ID
   * @params {String} [payload.urlReturn] - URL to redirect the test-taker to after scheduling
   * @params {String} [payload.notify] - Whether to notify the test-taker of this scheduling by e-mail. Default to 'Y"
   * @returns {Promise}
   */
  moveReservation(payload) {
    const methodName = 'moveReservation';

    return this
      ._validateData(methodName, payload)
      .then(()=>{
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName);
      })
      .then((response) => {
        return this
          ._post(response.url)
          ._send(response.payload)
          ._end();
      });
  }

}

module.exports = Client;
