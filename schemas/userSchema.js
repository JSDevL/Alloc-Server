const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	userName: {
		type: String,
		trim: true,
		required: [true, "Username is required"],
		unique: [true, "Username already exists"],
		validate: {
			validator: function(v) {
				if(v.length>2) return true;
				return false;
			},
			message: 'Username needs to be longer than two characters'
		}
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		validate: {
			validator: function(v) {
				if(v.length>8) return true;
				return false;
			},
			message: 'Password needs to be longer than eight characters'
		}
	},
	stages: {
		prereqs: {
			state: {
				type: Boolean,
				default: false
			},
			subStages: {
				building: {
					state: {
						type: Boolean,
						default: false
					}
				},
				combinations: {
					state: {
						type: Boolean,
						default: false
					}
				},
				sessions: {
					state: {
						type: Boolean,
						default: false
					}
				}
			}
		},
		combinationsToSessions: {
			state: {
				type: Boolean,
				default: false
			}
		},
		allocation: {
			state: {
				type: Boolean,
				default: false
			}
		}
	}
});

userSchema.pre("save", function(next){
    /* generate hash before save method */
	this.password = bcrypt.hashSync(this.password);
	next();
});

module.exports = userSchema;
