const mongoose = require('mongoose');
/* Registration, Login */
module.exports.User = mongoose.model('users', require('./schemas/userSchema.js'));
/* Block */
module.exports.Block = mongoose.model('blocks', require('./schemas/blockSchema.js'));
/* Room */
module.exports.Room = mongoose.model('rooms', require('./schemas/roomSchema.js'));
/* Batch */
module.exports.Batch = mongoose.model('batches', require('./schemas/batchSchema.js'));
/* Session */
module.exports.Session = mongoose.model('sessions', require('./schemas/sessionSchema.js'));