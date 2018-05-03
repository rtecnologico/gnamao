var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var situacaoSchema = new Schema({
 
	
	situacao: {
		type: String,
		required: false
	}



});

var Situacao = mongoose.model('situacoes', situacaoSchema);

module.exports = Situacao;