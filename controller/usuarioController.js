var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

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
	},
	banco: {
		type: String,
		required: false
	},
	titularConta: {
		type: String,
		required: false
	},
	tipoConta: {
		type: String,
		required: false
	},
	agenciaBancaria: {
		type: String,
		required: false
	},
	contaBancaria: {
		type: String,
		required: false
	},
	opBancaria: {
		type: String,
		required: false
	},
	cpf: {
		type: String,
		required: false
	},
	qtdCancelamentos: {
		type: Number,
		required: false
	},
	qtdExcluidos: {
		type: Number,
		required: false
	},
	listaNegra: {
		type: Boolean,
		required: false
	},
	qtdNotificado: {
		type: Number,
		required: false
	},
	dataUltimaNotificacao: {
		type: Date,
		required: false
	}

}, { collection: '_User' });

var User = mongoose.model('user', userSchema);

module.exports = User;
