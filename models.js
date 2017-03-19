const mongoose = require('mongoose');
/* Registration, Login */
module.exports.User = mongoose.model('users', require('./schemas/userSchema.js'));
/* Batch */
module.exports.Batch = mongoose.model('batches', require('./schemas/BatchSchema.js'));
