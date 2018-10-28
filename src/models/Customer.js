const mongoose =  require('mongoose');

const customerSchema = new mongoose.Schema({
	customerId: String,
	mode: String
});


module.exports = mongoose.model('Customer',customerSchema);