// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Load third party dependencies
const app = require('express')();
const createError = require('http-errors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');

//const routes = require('../api/routes/v1');

const mongoose = require('./mongoose');

// MongoDB connection via mongoose ORM
mongoose.connect();

const customerID = require('./CustomerID.js');

// Load our custom classes
const CustomerStore = require('./customerStore.js');
const MessageStore = require('./messageStore.js');
const MessageRouter = require('./messageRouter.js');

const { 
  DF_SERVICE_ACCOUNT_PATH, 
  DF_PROJECT_ID, 
  PORT, 
  logs } = require('./vars');

var name = "";
var mobile = "";

// Grab the service account credentials path from an environment variable
const keyPath = DF_SERVICE_ACCOUNT_PATH;
if(!keyPath) {
  console.log('You need to specify a path to a service account keypair in environment variable DF_SERVICE_ACCOUNT_PATH. See README.md for details.');
  process.exit(1);
}


// Load and instantiate the Dialogflow client library
const { SessionsClient } = require('dialogflow');
const dialogflowClient = new SessionsClient({
  keyFilename: keyPath
});

// Grab the Dialogflow project ID from an environment variable
const projectId = DF_PROJECT_ID;
if(!projectId) {
  console.log('You need to specify a project ID in the environment variable DF_PROJECT_ID. See README.md for details.');
  process.exit(1);
}

// Instantiate our app
const customerStore = new CustomerStore();
const messageStore = new MessageStore();
const messageRouter = new MessageRouter({
  customerStore: customerStore,
  messageStore: messageStore,
  dialogflowClient: dialogflowClient,
  projectId: projectId,
  customerRoom: io.of('/customer'),
  operatorRoom: io.of('/operator')
});


// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());


// mount api v1 routes
// app.use('/v1', routes);

// Serve static html files for the customer and operator clients
app.get('/customer', (req, res) => {
  //console.log("CustomerName", req.query.name);
  //console.log("CustomerMobile", req.query.mobile);
  res.sendFile(`${__dirname}/static/customer.html`);
});


app.get('/attention.ogg', (req, res) => {
  res.sendFile(`${__dirname}/static/attention.ogg`);
});

app.get('/operator', (req, res) => {
  res.sendFile(`${__dirname}/static/operator.html`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

});

// Begin responding to websocket and http requests
messageRouter.handleConnections();
http.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
