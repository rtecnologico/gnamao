var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_oldSchema = new Schema({

		username: {
		type: String,
		required: false
	},
	isClient: {
		type: Boolean,
		required: false
	},
	password: {
		type: String,
		required: false
	},
	availability: {
		type: Boolean,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	brand: {
		type: String,
		required: false
	},
	model: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},
	cep: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: false
	},
	state: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false
	},
	winchModels: {
		type: String,
		required: false
	},
	trailerCapacity: {
		type: String,
		required: false
	},
	towCapacities: {
		type: String,
		required: false
	},
	createdAt: {
		type: Date,
		required: false
	},
	updatedAt: {
		type: Date,
		required: false
	},
	emailVerified: {
		type: Boolean,
		required: false
	},
	placauser: {
		type: String,
		required: false
	},
	codseg: {
		type: String,
		required: false
	},
	rntt: {
		type: String,
		required: false
	},
	regid: {
		type: String,
		required: false
	},
	device: {
		type: String,
		required: false
	},
	avaliacaoSatisfatoria: {
		type: String,
		required: false
	}

	//lastPositionGeoPoint: {
	//	type: String,
	//	required: true
	//},
}, { collection: '_User_old' });

var User_old = mongoose.model('user_old', user_oldSchema);

module.exports = User_old;
