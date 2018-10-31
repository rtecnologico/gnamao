var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cancelamentoSchema = new Schema({
 
	
	tipo: {
		type: String,
		required: false
	},
	request: {
		type:String,
		required: false
	},
	guincho: {
		type: String,
		required: true
	},
	usuario: {
		type: String,
		required: true
	},
	autorCancelamento: {
		type: String,
		required: true
	},
	dataHoraRequest: {
		type: Date,
		required: true
	},
	averiguado: {
		type: Boolean,
		required: false
	},
	dataAveriguado: {
		type: Date,
		required: false
	},
	createdAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		required: false
	}

});

var Cancelamento = mongoose.model('cancelamento', cancelamentoSchema);

module.exports = Cancelamento;
