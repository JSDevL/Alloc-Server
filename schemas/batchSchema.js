const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require("underscore");

const batchSchema = new Schema({
	combination: {
		type: String,
		required: true,
		trim: true
	},
	year: {
		type: Number,
		min: 1,
		required: true
	},
	prefix: {
		type: String,
		uppercase: true,
		trim: true
	},
	strength: {
		type: Number,
		min: 1
	},
	exclusions: [{
		type: Number
	}],
	gradLevel: {
		type: String,
		required: true,
		trim: true,
		uppercase: true,
		enum: ['UG', 'PG']
	},
	conflicts: [{
		type: String,
		trim: true
	}]
});

/* unique compound index */
batchSchema.index({ combination: 1, year: 1}, { unique: true });
/* validations */
batchSchema.pre("save", function(next){
	// remove any duplicate conflicts
	this.conflicts = _.uniq(this.conflicts, function(conflict){ return conflict; });
	// remove self conflict in conflicts
	this.conflicts = _.reject(this.conflicts, (conflict)=>{ return conflict === this.combination; });
	/* number of batches cannot exceed duration years */
	if( this.gradLevel === "UG" && this.year > 3 )
		next(new Error("Batch year cannot exceed duration years"));
	if( this.gradLevel === "PG" && this.year > 2 )
		next(new Error("Batch year cannot exceed duration years"));
	next();
});


module.exports = batchSchema;