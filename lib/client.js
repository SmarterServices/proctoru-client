'use strict';

const _ = require('lodash');
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
    this._host = config.host;
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
        if (response.response_code === 1) {
          //if it is a success response
          return Promise.resolve(response);
        } else {
          //some error occured, so reject with error
          return Promise.reject(response);
        }
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

    //Timestamp that should be sent of the current time in iso format
    let queryParams;
    if (method === 'GET') {
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
   * Returns list of TimeZones
   * @returns {Promise}
   */
  getTimeZoneList() {

    const url = this._getUrl('getTimeZoneList');

    return this
      ._get(url)
      ._end();
  }

}

module.exports = Client;
