const mongoose = require('mongoose');
/* Registration, Login */
module.exports.User = mongoose.model('users', require('./schemas/userSchema.js'));
/* Room */
module.exports.Room = mongoose.model('rooms', require('./schemas/roomSchema.js'));
/* Block, Floor */
module.exports.Block = mongoose.model('blocks', require('./schemas/blockSchema.js'));
/* Batch */
module.exports.Batch = mongoose.model('batches', require('./schemas/BatchSchema.js'));
/* Sessions */
module.exports.Session = mongoose.model('sessions', require('./schemas/sessionSchema.js'));
