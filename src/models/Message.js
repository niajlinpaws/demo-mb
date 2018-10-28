const mongoose =  require('mongoose');

const messageSchema = new mongoose.Schema({
	customerId: String,
    isAgentResponse: Boolean,
    utterance:String,
    sender:{
        type: String,
        default: 'customer'
    }
});


module.exports = mongoose.model('Message',messageSchema);