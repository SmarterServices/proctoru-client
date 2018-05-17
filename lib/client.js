'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const payloadSchema = require('../schema/payload-schema');
const utils = require('./helpers/utils');

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
  }

  /**
   * Modifies host string to remove unnecessary part
   * @param {String} host
   * @returns {String} modifiedHost
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
   * @param {string} method
   * @param {string} url
   * @return {Object<Client>}
   * @memberof Client
   */
  _setMethodAndEndpoint(method, url) {
    this._method = method;
    this._url = url;
    return this;
  }

  /**
   * @param {string} endpoint
   * @returns {Object<Client}
   * @memberof Client
   */
  _get(endpoint) {
    return this._setMethodAndEndpoint('GET', endpoint);
  }

  /**
   * @param {string} endpoint
   * @returns {Object<Client}
   * @memberof Client
   */
  _post(endpoint) {
    return this._setMethodAndEndpoint('POST', endpoint);
  }

  /**
   * @param {string} endpoint
   * @returns {Object<Client}
   * @memberof Client
   */
  _put(endpoint) {
    return this._setMethodAndEndpoint('PUT', endpoint);
  }

  /**
   * @param {string} endpoint
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

    const SUCCESS_CODE = 1;

    const requestOptions = {
      url: this._url,
      method: this._method,
      json: true,
      body: this._payload,
      headers: {
        'Authorization-Token': this._authorizationToken
      },
      resolveWithFullResponse: false
    };

    return requestPromise(requestOptions)
      .then((response)=>{
        if (response.response_code !== SUCCESS_CODE) {
          //if any error has occured
          return Promise.reject(response);
        }

        return Promise.resolve(response);
      });
  }

  /**
   * Create url for request
   * @param {string} endpointName - name of the endpoint
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
   * @param {string} methodName - Request method name
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
    const snakeCasePayload = _.mapKeys(payload, function(value, key) {
      return _.snakeCase(key);
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
   * Returns  list of active reservations for a single test-taker
   * @params {Object} params- params to request with
   * @returns {Promise}
   */
  getStudentReservationList(queryParams) {
    const methodName = 'getStudentReservationList';

    return this
      ._validateData(methodName, queryParams)
      .then(()=>{
        //convert params to snakeCase and make url
        queryParams = this._convertToSnakeCase(queryParams);
        const url = this._getUrl(methodName, {}, queryParams);

        return this._get(url)._end();
      });
  }

  /**
   * Returns  list of active reservations for a single test-taker
   * @params {Object} params- params to request with
   * @returns {Promise}
   */
  getScheduleInfoAvailableTimesList(queryParams) {
    const methodName = 'getScheduleInfoAvailableTimesList';

    return this
      ._validateData(methodName, queryParams)
      .then(()=>{
        //convert params to snakeCase and make url
        queryParams = this._convertToSnakeCase(queryParams);
        const url = this._getUrl(methodName, {}, queryParams);

        return this._get(url)._end();
      });
  }

  /**
   * Retrieves a URL for a student to begin taking an exam.
   * @params {Object} payload
   * @returns {Promise}
   */
  beginReservation(payload) {
    const methodName = 'beginReservation';

    return this
      ._validateData(methodName, payload)
      .then(()=>{
        //convert params to snakeCase and make url
        payload = this._convertToSnakeCase(payload);
        const url = this._getUrl(methodName);

        payload.time_sent = new Date().toISOString();

        return this
          ._post(url)
          ._send(payload)
          ._end();
      });
  }

}

module.exports = Client;
