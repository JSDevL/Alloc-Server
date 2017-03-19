const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		enum: ['morning', 'afternoon', 'evening']
	},
	start: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^\d{2}:\d{2}$/.test(v);
			}
		}
	},
	end: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^\d{2}:\d{2}$/.test(v);
			}
		}
	},
	batches: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'batches'
	}],
	allotedStrength: {
		type: Number,
		default: 0,
		min: 0
	}
});

sessionSchema.pre('save', function(next){
	let start  = this.start.split(':');
	let end = this.end.split(':');

	start = parseInt(start.join(''));
	end = parseInt(end.join(''));

	if(start>end){
		next(new Error("start time cannot exceed end time"));
	}

	next();
});

module.exports = sessionSchema;