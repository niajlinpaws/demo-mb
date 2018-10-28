const Message = require('./src/models/Message');

class MessageStore {    
    getMessages(customerId){
        return Message.find({ 
            customerId : { 
              $in : customerId
            }
          });
    }

    createMessage(message){
        return Message.create(message);
    }
};


module.exports = MessageStore;  