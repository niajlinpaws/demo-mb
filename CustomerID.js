// These variables will stay in the local scope of this module 
class CustomerID {

    constructor(customerId){
        this.customerId = customerId;
    }

    getCustomerID(){
        return customerId;
    }
}
module.exports = CustomerID;