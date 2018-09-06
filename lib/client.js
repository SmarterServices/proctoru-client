'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const payloadSchema = require('../schema/payload-schema');
const utils = require('./helpers/utils');
const whiteList = require('./../config/white-list.json');
const blackList = require('./../config/black-list.json');
const camelize = require('camelize');

const CREDENTIAL_PROPERTIES = [
  'host',
  'authorizationToken'
];

class Client {
  /**
   * Configure the client
   * @private
   */
  constructor() {
    this.SUCCESS_CODE = 1;
  }

  /**
   * Modifies host string to remove unnecessary part
   * @param {string} host - Host name for request
   * @returns {string} modifiedHost - Modified name of the host
   * @private
   */
  _sanitizeHost(host) {
    let modifiedHost = host;
    if (host.endsWith('/')) {
      //if host ends with a slash,
      //drop that since there is one in apiList
      modifiedHost = host.slice(0, host.length - 1);
    }
    return modifiedHost;
  }

  /**
   * Send the actual request with method, url and payload
   * @param {string} url - Url to request with
   * @param {string} method - HTTP method to request with
   * @param {string} token - The authorization Token to assign in header
   * @param {string} [payload] - The payload to send as form
   * @return {Promise} - response
   * @memberof Client
   * @private
   */
  _sendRequest(url, method, token, payload) {

    const requestOptions = {
      url,
      method,
      json: true,
      form: payload,
      headers: {
        'Authorization-Token': token
      },
      resolveWithFullResponse: false
    };

    return requestPromise(requestOptions)
      .then((response) => {
        if (response.response_code !== this.SUCCESS_CODE) {
          //if any error has occured
          return Promise.reject(response);
        }

        return Promise.resolve(response);
      });
  }

  /**
   * Send the actual request to get an oauth token with method, url and payload
   * @param {string} url - Url to request with
   * @param {string} method - HTTP method to request with
   * @param {string} token - The authorization Token to assign in header
   * @param {string} [payload] - The payload to send as form
   * @return {Promise} - response
   * @memberof Client
   * @private
   */
  _sendRequestForToken(url, method, token, payload) {

    const requestOptions = {
      url,
      method,
      json: true,
      form: payload,
      headers: {
        'Authorization-Token': token
      },
      resolveWithFullResponse: false
    };
    return requestPromise(requestOptions)
      .then((response) => {
        if (response.oauth_token) {
          //if any error has occured
          return Promise.resolve(response);
        }
        return Promise.reject(response);
      });
  }

  /**
   * Returns url and method for request
   * @param {string} endpointName - Name of the endpoint
   * @param {Object} credentials - Necessary credentials
   * @param {string} credentials.host - Host name for request
   * @param {string} credentials.authorizationToken - Api Token to send in header
   * @param {Object} [params] - Param values
   * @param {Object} [query] - Query values
   * @returns {Object} - Url and method to request with
   * @private
   * @memberof Client
   */
  _getUrlAndMethod(endpointName, credentials, params = {}, query) {
    const host = this._sanitizeHost(credentials.host);
    const urlTemplate = host + apiList[endpointName].endpoint;
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
    return {url, method};
  }

  /**
   * Validates request payload against joi schema
   * @param {string} methodName - Request method name
   * @param {Object} payload - Request payload
   * @returns {Promise}
   * @private
   */
  _validateData(methodName, payload) {
    let schema = payloadSchema[methodName] || {};

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
   * Validate options provided in the API method
   * and returns validated Objects
   * @param {string} apiName - API name in API list
   * @param {Object} options - The options object
   * @returns {Promise<Object>} - Credentials and payload
   * @resolves {{credentials:Object, payload:Object}}
   * @private
   */
  _validateOptions(apiName, options) {
    const credentials = _.pick(options, CREDENTIAL_PROPERTIES);
    const payload = _.omit(options, CREDENTIAL_PROPERTIES);


    return this
      ._validateData('credential', credentials)
      .then(() => this._validateData(apiName, payload))
      .then(() => {
        return Promise.resolve({credentials, payload});
      });
  }

  /**
   * Converts a camelCase object into snakeCase object
   * @param {Object} payload - The camelCase payload to convert
   * @returns {Object} snakeCasePayload - The converted payload
   * @private
   */
  _convertToSnakeCase(payload) {
    const list = whiteList.list;
    const snakeCasePayload = _.mapKeys(payload, function (value, key) {
      if (list.includes(key)) {
        return key;
      } else {
        return _.snakeCase(key);
      }
    });
    return snakeCasePayload;
  }

  /**
   * Returns the details of a reservation for a single test-taker
   * @param {Object} options - Options for request
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @param {string} options.studentId - Institution's unique test-taker ID
   * @param {string} reservationNo - The reservation number to look up.
   * @returns {Promise} - List of active reservation
   */
  getReservationDetails(options, reservationNo) {
    const apiName = 'clientActivityReport';

    return this
      ._validateOptions(apiName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, apiName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .then((response) => {
        return _.find(response.data, { 'ReservationNo': reservationNo });
      })
      // now we need to add the status based on some logic, this is a very
      // hacky way of doing this, but it is the only way we can get a status
      // for the session.
      .then((response) => {
        // to standardize the lookup, lowercase it all.
        let notes = _.lowerCase(response.ProctorNotes);

        if(_.includes(notes, 'reservation cancelled')){
          response.Status = 'Cancelled';
        }else if(_.includes(notes, 'fulfillment ended')){
          response.Status = 'Closed';
        }else if(_.includes(notes, 'fulfillment started')){
          response.Status = 'In Progress';
        }else if(_.includes(notes, 'fulfillment created')){
          response.Status = 'Scheduled';
        }else{
          response.Status = 'Scheduled';
        }
        return response;
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns list of TimeZones
   * @param {Object} options - Options for request
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @returns {Promise} - List of timeZones
   */
  getTimeZoneList(options) {
    const apiName = 'getTimeZoneList';

    return this
      ._validateOptions(apiName, options)
      .then(({credentials}) => {
        const {url, method} = this._getUrlAndMethod(apiName, credentials);
        return this._sendRequest(url, method, credentials.authorizationToken);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns required url and method and token for get endpoint
   * @param {Object} queryParams - Params that should be converted to camel case
   * @param {Object} credentials - Necessary Credentials
   * @param {string} credentials.host - Host name for request
   * @param {string} credentials.authorizationToken - Api Token to send in header
   * @param {string} methodName - Name of the method to search for
   * @returns {Promise<Object>} - Url, method and token
   * @private
   */
  _getParamsAndUrl(queryParams, credentials, methodName) {
    queryParams = this._convertToSnakeCase(queryParams);
    const {url, method} = this._getUrlAndMethod(methodName, credentials, {}, queryParams);
    const authorizationToken = credentials.authorizationToken;
    return Promise.resolve({url, method, authorizationToken});
  }

  /**
   * Returns  list of active reservations for a single test-taker
   * @param {Object} options - Options for request
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @param {string} options.studentId - Institution's unique test-taker ID
   * @returns {Promise} - List of active reservation
   */
  getStudentReservationList(options) {
    const methodName = 'getStudentReservationList';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._getParamsAndUrl(payload, credentials, methodName);
      })
      .then((response) => {
        return this._sendRequest(response.url, response.method, response.authorizationToken);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns  list of active reservations for a single test-taker
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {Number} options.studentId- Institution's unique test-taker ID
   * @params {string} options.timeZoneId- Time Zone ID - please call getTimeZoneList for a list of IDs
   * @params {Number} options.examId- Institution's unique exam ID. Pass this back in order to update the exam
   * @params {string} options.startDate- Date for the times that you would like to see, ISO time format in utc zone
   * @params {string} [options.takeitnow]- If this flag is true and the record is uploaded successfully, the student will be sent an email containing the URL, their user_id, user_password, and login instructions for ProctorU
   * @params {Number} options.duration- Length of the exam in minutes
   * @params {Number} [options.reservationNo]- Used to edit a previous appointment
   * @params {string} [options.isadhoc]- Specifies whether the request is for an addAdHoc request
   * @returns {Promise} - List of active reservations for a single test-taker
   */
  getScheduleInfoAvailableTimesList(options) {
    const methodName = 'getScheduleInfoAvailableTimesList';
    return this
      ._validateOptions(methodName, options)
      .then((response) => {
        const queryParams = response.payload;
        //convert params to snakeCase and make url
        return this._getParamsAndUrl(queryParams, response.credentials, methodName);
      })
      .then((response) => {
        return this._sendRequest(response.url, response.method, response.authorizationToken);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns url,method, token and payload of post endpoint
   * @param {Object} payload - Payload that should be converted to camel case
   * @param {string} methodName - Name of the method to search for
   * @param {Object} credentials - Necessary Credentials
   * @param {string} credentials.host - Host name for request
   * @param {string} credentials.authorizationToken - Api Token to send in header
   * @returns {Promise<Object>} - Required url, method, token, payload of post endpoint
   * @private
   */
  _postPayloadAndUrl(payload, methodName, credentials) {
    payload = this._convertToSnakeCase(payload);
    const {url, method} = this._getUrlAndMethod(methodName, credentials);

    //check that we should skip adding time_sent or not
    let skipTimeSent = blackList.timeSent.find(name => name === methodName);

    if (!skipTimeSent) {
      payload.time_sent = new Date().toISOString();
    }
    const authorizationToken = credentials.authorizationToken;
    return Promise.resolve({payload, url, method, authorizationToken});
  }

  /**
   * Retrieves a URL for a student to begin taking an exam.
   * @params {Object} options - The payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {number} options.studentId - Institution's unique test-taker ID
   * @params {number} options.reservationId - Institution's unique reservation ID
   * @params {number} [options.reservationNo] - ProctorU's unique reservation number
   * @returns {Promise} - URL
   */
  beginReservation(options) {
    const methodName = 'beginReservation';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Reserves a time for a test-taker to take an exam when an exam list is not being used.
   * @params {Object} options - The payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {number} options.studentId - Institution's unique test-taker ID
   * @params {string} options.lastName - Test-taker's last name
   * @params {string} options.firstName - Test-taker's first name
   * @params {string} options.address1 - Test-taker's Address 1 *required if US only
   * @params {string} [options.address2] - Test-taker's Address 2
   * @params {string} options.city - Test-taker's City *required if US only
   * @params {string} options.state - Test-taker's State *required if US only
   * @params {string} options.country - Test-taker's Country
   * @params {number} options.zipcode - Test-taker's zip or postal code
   * @params {number} options.phone1 - Test-taker's Primary Telephone number
   * @params {number} [options.phone2] - Test-taker's Secondary Telephone number
   * @params {string} options.email - Test-taker's Email
   * @params {string} options.timeZoneId - Time Zone ID - please call getTimeZoneList for a list of IDs
   * @params {string} options.description - Title of the exam
   * @params {number} options.duration - Total time allowed for the exam in minutes
   * @params {string} [options.notes] - Notes that only the proctors / ProctorU can view
   * @params {string} options.startDate - Date the reservation will be available, ISO time format in utc zone
   * @params {number} options.reservationId - Institution's unique reservation ID
   * @params {number} [options.reservationNo] - ProctorU's unique reservation ID
   * @params {string} [options.comments] - Comments input by the test-taker
   * @params {string} [options.takeitnow] - If this flag is true and the record is uploaded successfully, the student will be sent an email containing the URL, their user_id, user_password, and login instructions for ProctorU
   * @params {string} [options.urlReturn] - URL to redirect the test-taker to after scheduling
   * @params {string} [options.notify] - Whether to notify the test-taker of this scheduling by e-mail.
   * @params {string} [options.examUrl] - URL where the exam is located
   * @params {string} [options.examPassword] - Password for the exam
   * @returns {Promise} - Detail of reservation that has been booked
   */
  addAdHocProcess(options) {
    const methodName = 'addAdHocProcess';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Removes a reservation from the schedule
   * @params {Object} options - Payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {number} options.studentId - Institution's unique test-taker ID
   * @params {number} options.reservationNo - ProctorU's unique reservation ID
   * @params {string} [options.explanation] - Explanation
   * @returns {Promise} - Removed reservation's details
   */
  removeReservation(options) {
    const methodName = 'removeReservation';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Moves an existing reservation from a past date to a future date if the reservation was not used..
   * @params {Object} options - Payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {number} options.reservationNo - ProctorU unique reservation ID
   * @params {string} options.startDate - Date the reservation will be available
   * @params {string} options.startDate - Date the reservation will be available
   * @params {number} options.reservationId - Institution's unique reservation ID
   * @params {string} [options.urlReturn] - URL to redirect the test-taker to after scheduling
   * @params {string} [options.notify] - Whether to notify the test-taker of this scheduling by e-mail. Default to 'Y"
   * @returns {Promise} - Detail of moved reservation
   */
  moveReservation(options) {
    const methodName = 'moveReservation';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns a URL where the institution can direct the student's browser
   * @params {Object} options - The payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @params {number} options.studentId - Institution's unique test-taker ID
   * @params {string} options.lastName - Test-taker's last name
   * @params {string} options.firstName - Test-taker's first name
   * @params {string} options.email - Test-taker's Email
   * @params {string} options.timeZoneId - Time Zone ID - please call getTimeZoneList for a list of IDs
   * @params {string} [options.urlReturn] - URL to redirect the test-taker to after scheduling
   * @params {number} [options.update] - Updates the information of the user with the given payload if true
   * @returns {Promise} - Resolves the URL where the institution can direct the student's browser
   */
  autoLogin(options) {
    const methodName = 'autoLogin';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        return this._sendRequest(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

  /**
   * Returns a oauth token
   * @params {Object} options - The payload to request with
   * @param {string} options.host - Host name for request
   * @param {string} options.authorizationToken - Api Token to send in header
   * @returns {Promise} - Resolves the token
   */
  getOAuthToken(options) {
    const methodName = 'getOAuthToken';

    return this
      ._validateOptions(methodName, options)
      .then(({credentials, payload}) => {
        //convert params to snakeCase and make url
        return this._postPayloadAndUrl(payload, methodName, credentials);
      })
      .then(({url, method, payload, authorizationToken}) => {
        //not sending payload as it might not take time_sent
        return this._sendRequestForToken(url, method, authorizationToken, payload);
      })
      .then((response) => {
        return camelize(response);
      })
      .catch((error) => {
        return Promise.reject(camelize(error));
      });
  }

}

module.exports = Client;
