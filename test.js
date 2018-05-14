'use strict';

const Client = require('./index');

const client = new Client({
  host: 'https://demo.proctoru.com/api',
  authorizationToken: 'd9c4e406-e7ca-4a4e-a44f-79167deb30b7'
});

client
  .getTimeZoneList()
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err.message);
  });
