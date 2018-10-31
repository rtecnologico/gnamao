var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestSchema = new Schema({
 
	
	observations: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	price: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: false
	},
	placa: {
		type: String,
		required: false
	},
	situacao: {
		type: String,
		required: false
	},
	provider: {
		type: String,
		required: false
	},
	from: {
		type: String,
		required: true
	},
	answered: {
		type: Boolean,
		required: false
	},
	services: {
		type: Array,
		required: false
	},
	createdAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		required: false
	},
	paymentMethod: {
		type: String,
		required: false
	},
	inNegotiation: {
		type: Boolean,
		required: false
	},
	formattedDate : {
		type: String,
		required: false
	},
	useGPS : {
		type: String,
		required: false
	},
	clientPayed : {
		type: String,
		required: false
	},
	clientPaymentRequested : {
		type: String,
		required: false
	},
	paymentOption : {
		type: String,
		required: false
	},
	date: {
		type: Date,
		required: true
	},
	lastPositionGeoPoint: {
		type: Array,
		required: false
	},
	enderCurto: {
		type: String,
		required: false
	},
	towCapacities: {
		type: String,
		required: false
	},
	enderCompleto: {
		type: String,
		required: false
	},
	visivelcliente: {
		type: Boolean,
		required: false
	},
	visivelguincho: {
		type: Boolean,
		required: false
	},
	datadelete: {
		type: Date,
		required: false
	},
	enderCurtoDest: {
		type: String,
		required: false
	},
	enderCompletoDest: {
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
	requisicaoFinalizada: {
		type: Boolean,
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
	dataPagamento: {
		type: Date,
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
	},
	avaliacaoAtendimento: {
		type: String,
		required: false
	},
	avaliado: {
		type: Boolean,
		required: false
	}

});

var Request = mongoose.model('request', requestSchema);

module.exports = Request;
