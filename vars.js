const path = require('path');


// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '.env'),
  sample: path.join(__dirname, '.env.example'),
});

let {
  NODE_ENV,
  PORT,
  DF_PROJECT_ID,
  DF_SERVICE_ACCOUNT_PATH,
  MONGO_URI,
  MONGO_URI_TESTS
} = process.env; 

module.exports = {
  NODE_ENV,
  PORT,
  DF_PROJECT_ID,
  DF_SERVICE_ACCOUNT_PATH,
  MONGO_URI: NODE_ENV === 'test'? MONGO_URI_TESTS : MONGO_URI,
  logs: NODE_ENV === 'production' ? 'combined' : 'dev',
};