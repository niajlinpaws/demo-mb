const mongoose = require('mongoose');

const { MONGO_URI, NODE_ENV } = require('./vars');


// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (NODE_ENV === 'development') {
  mongoose.set('debug', true);
}


exports.connect = () => {
	mongoose.connect(MONGO_URI,{ useNewUrlParser : true });

	return mongoose.connection;
};