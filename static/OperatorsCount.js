// These variables will stay in the local scope of this module (in this case, person.js)
var count = 0;

// Make sure your argument name doesn't conflict with variables set above
exports.setCustomerCount = function (count) {
    this.count = count;
};


exports.getCustomerCount = function () {
    return {
        count
    };
};