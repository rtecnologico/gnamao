var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({


	
	request: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	formattedDate: {
		type: Date,
		required: false
	},
	to: {
		type: String,
		required: true
	},
	clientAccepted: {
		type: Boolean,
		required: false
	},
	clientPaymentRequested: {
		type: Boolean,
		required: false
	},
	providerAccepted: {
		type: Boolean,
		required: false
	},
	clientPayed: {
		type: Boolean,
		required: false
	},
	createdAt: {
		type: Date,
		required: true
	},
	paymentOption: {
		type: String,
		required: false
	},
	price: {
		type: String,
		required: false
	},
	state: {
		type: String,
		required: false
	},
	lastPositionGeoPoint: {
		type: String,
		required: false
	},
	enderCurto: {
		type: String,
		required: false
	},
	enderCompleto: {
		type: String,
		required: false
	},
	nomeguincho: {
		type: String,
		required: false
	},
	telefoneguincho: {
		type: String,
		required: false
	
	},
	idProprioMoip: {
		type: String,
		required: false
	},
	idMoip: {
		type: String,
		required: false
	},
	statusPagamento: {
		type: String,
		required: false
	},
	recebedorPagamento: {
		type: String,
		required: false
	},
	pagamentoRepassado:{
		type: Boolean,
		required: false
	},
	valorRepasse: {
		type: String,
		required: false
	},
	taxaServico: {
		type: String,
		required: false
	},
	dataRepasse: {
		type: Date,
		required: false
	},
	taxaServicoPaga: {
		type: Boolean,
		required: false
	},
	dataTaxaServicoPaga: {
		type: Date,
		required: false
	},
	idProprioMoipTaxa: {
		type: String,
		required: false
	}

});

var Service = mongoose.model('service', serviceSchema);

module.exports = Service;
