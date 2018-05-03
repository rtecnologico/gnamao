var express = require('express');
var router = express.Router();
var User = require('../controller/usuarioController');
var Request = require('../controller/requestController');
var Service = require('../controller/serviceController');
var Situacao = require('../controller/situacaoController');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var apn = require('apn');
var Moip = require("moip");
var url = 'https://guinchonamao.herokuapp.com';

var gcm = require('node-gcm');
 router.get('/', function(req, res, next) {
	res.render('index', { title: 'teste' });
});



router.get('/deletarteste/:userId', function(req,res,mext){

//req.body.iduser
User.remove({_id:req.params.userId}, function(err) {
    if (!err) {
              res.send('erro');
   
    }
    else {
         res.send('sucesso');
    }
});

});
 router.get('/mteste', function(req, res, next) {
	 
	 var teste =  { title: 'teste' };
	res.send(teste);
});

router.get('/porce', function(req, res, next) {
	
      var porcentagem = 20/100;
     var percent = 35020 * porcentagem;
	var percentfinal = percent /100;
     
	        res.send(percentfinal);

});

router.get('/testenotificacao', function(req, res, next) {
	
User.where('isClient', 'false').where('state','Bahia' ).find(function(err, listguincho){

			
		for(var i = 0; i < listguincho.length; i++ ){
			
			if(listguincho[i].device === 'android'){
				
				var message = new gcm.Message({
					 collapseKey: 'demo',  

			   data: {
				
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Nova solicitação !',
                            body: 'Nova solicitação de atendimento em sua área de atuação !'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [listguincho[i].regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
			}
			
		}

	});

});

router.post('/naspretorno', function(req, res, next) {
     

		if(req.body.status_pagamento == 1){
		   
		   var texto ="Pagamento autorizado pelo pagador, porém ainda não creditado para o recebedor em razão do floating";
	var statuspaga = "Autorizado";
		   }
			
		  if(req.body.status_pagamento == 2){
		   
		   var texto ="Pagamento foi iniciado, mas não existem garantias de que será finalizado";
			var statuspaga = "Iniciado";
			var taxapaga = false;
		
		   }
			
		if(req.body.status_pagamento == 3){
		   
	       var texto ="Pagamento ainda não foi confirmado, porém boleto bancário foi impresso e pode ter sido pago (não existem garantias de que será pago)";
               var statuspaga = "BoletoImpresso";
			var taxapaga = false;
			
		 }
		
		if(req.body.status_pagamento == 4){
		   
		   var texto ="Pagamento foi concluído, dinheiro debitado do pagador e creditado para o recebedor";
			var statuspaga = "Concluido";
			var taxapaga = true;
			
		 }
		if(req.body.status_pagamento == 5){
		   
		   var texto ="Pagamento foi cancelado por quem estava pagando";
			var statuspaga = "Cancelado";
			var taxapaga = false;
		 }
	
		if(req.body.status_pagamento == 6){
		   
		   var texto ="Pagamento autorizado pelo pagador, mas está em análise e não tem garantias de que será autorizado";
			var statuspaga = "Em analise";
			var taxapaga = false;
			
		 }
	
		if(req.body.status_pagamento == 7){
		   
		   var texto ="Pagamento foi concluído, dinheiro creditado para o recebedor, porém estornado para o cartão de crédito do pagador";
                  var statuspaga = "Estornado";
			var taxapaga = false;
			
		 }
		
	if(req.body.status_pagamento == 9){
		   
		   var texto ="Pagamento foi concluído, dinheiro creditado para o recebedor, porém houve o reembolso para a Carteira Moip do pagador";
			var statuspaga = "Reembolsado";
		var taxapaga = false;
		 }
	
	
	Request.find({idProprioMoipTaxa:req.body.id_transacao},function (err, requestall) { 
		var dataatual = new Date();

			var datafinal = Date();
		if(requestall.length > 1){
		   
			
			for(var i = 0; i < requestall.length; i++){
				
				Request.update({_id:requestall[i]._id}, { $set: {

				dataTaxaServicoPaga: datafinal,
				taxaServicoPaga: taxapaga
								

				} }, function (err, place) {
					
				
					
				});

				
			}
		   
		}else{
		
		
		
		
		Request.findOne({idProprioMoipTaxa:req.body.id_transacao},function (err, request) { 	
	
			
			if(request){
				
				var dataatual = new Date();

			var datafinal = Date();
			Request.findOneAndUpdate({idProprioMoipTaxa:req.body.id_transacao}, { $set: { 
				
				dataTaxaServicoPaga: datafinal,
				taxaServicoPaga: taxapaga
												    
												    
			 } 
											    
			
                     }, function (err, place) {
				
  	

	});
	
   Service.findOneAndUpdate({idProprioMoipTaxa:req.body.id_transacao}, { $set: {
	   
	  			dataTaxaServicoPaga: datafinal,
				taxaServicoPaga: taxapaga 
   
   } }, function (err, service) {  

	  
    });
			
			
		
			
			}else{
				
		Request.findOne({idProprioMoip:req.body.id_transacao},function (err, requestx) { 
	
		User.findOne({_id:requestx.from},function (err, usuario) { 
	
	
		//emailgeral(usuario.email,texto);
		
	
	        });
		
		User.findOne({_id:requestx.provider},function (err, provider) { 
	
	
		//emailgeral(provider.email,texto);
		
	
	        });
	
	
	});
	
	Request.findOneAndUpdate({idProprioMoip:req.body.id_transacao}, { $set: { 
		
		dataTaxaServicoPaga: datafinal,
		statusPagamento: statuspaga,
		taxaServicoPaga:taxapaga 
	
	} }, function (err, place) {
 

	});
	
   Service.findOneAndUpdate({idProprioMoip:req.body.id_transacao}, { $set: {  
	   
	   dataTaxaServicoPaga: datafinal,
	   statusPagamento: statuspaga,
	   taxaServicoPaga:taxapaga 
   
   
   } }, function (err, service) {  

	
    });
	
			

			
	}
			
	});
	
		
		
		
		
		}
		
		
		
		
		
		
	});
	
		
	
	
});

router.post('/coordguincho', function(req, res, next) {
     
	Service.findOne({request:req.body.idreq}, function (err, service) {  
    if(err){
			
		} else {
			
			res.send(service);
		}
});


});


router.post('/updatelocalguincho', function(req, res, next) {
	
	Service.update({ 'to': req.body.iduser }, {$set:{ 'lastPositionGeoPoint' : req.body.local }}, function(err, service){
	    if(err){
		
	    }

	    res.send(service);
	});

});




/* GET home page. */
router.post('/regid', function(req, res, next) {
	res.send(req.body.userid);
	res.send(req.body.regid);
      User.findOneAndUpdate({_id:req.body.userid}, { $set: { 
		
		
		regid: req.body.regid
	
	
		} }, function (err, place) {
			var content = "";
			if(err){

				content = "";
				content = "Não foi possivel cadastrar o guincheiro";

			}

			
		

});

	/*
	   var API_ACCESS_KEY = 'AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r';
    var regID = 'APA91bFc0w6y8RDV4Qt6Z6cgk9ktchF_OrIJ3rQzoqV53VvSm4OgQps3wlZEq1Sv14TmIXjb3HCDhga2dQFd4_I7JNXluULzYV1do6t644qqDTXng6jqp0qemPR-kchbdkiXpgJVJaZn';

    module.exports.send = function() {
        fetch('https://android.googleapis.com/gcm/send', {
            method: 'post',
            headers: {
                'Authorization': 'key=' + API_ACCESS_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registration_ids: [regID],
                data: {
                    notification: {
                        alert: {
                            title: 'Well would ya look at that!',
                            body: 'Hello from some other app'
                        }
                    },
                    payload: 'anything you like'
                }
            })
        }).then(function(response) {
    
        }, function(error) {

        });
    }
	
	res.send('aaaaaaaaaa');
*/	
 
var message = new gcm.Message({
	 collapseKey: 'demo',
            data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Well would ya look at that!',
                            body: 'Hello from some other app'
                        }
                    },
                    payload: 'anything you like'
                }
});
 
// Set up the sender with you API key, prepare your recipients' registration tokens. 
var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
var regTokens = ['APA91bH_OM6i-S8pR4eb3SNhxLjNIpLYEvIj7x0-VSNMWLTfrBnogdcLAWt4e6fJAmO71bY2tEydgO9XTTlAXhvF65esDpNHozaWC1DtVl5wwEmthmOKXVLvinY9RboU14Zvm-bzjAbC'];

sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if(err) res.send([{"nome":err }]);
    else 	 res.send([{"nome": response }]);
});  
	
});


router.post('/logar',function(req, res, next){

															
const cipher = crypto.createCipher('aes192', req.body.senha);

var encrypted = '';
cipher.on('readable', () => {
  var data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {

  // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
});

cipher.write('some clear text data');
cipher.end();

		User.findOne({username:req.body.login, password:encrypted},function (err, usuarios) {  
		  
		   if(err){
			
		} else {
				
			    User.findOneAndUpdate({username:req.body.login, password:encrypted}, { $set: { 
		
				regid: req.body.regid,
				device: req.body.device


				} }, function (err, place) {


				});

		
		res.send(usuarios);

		}

				});

		});

router.get('/listarsituacao', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	Situacao.find().exec(function(err, situacao){

		if(err){
			
		} else {
			
			res.send(situacao);
		}

	})

});



router.get('/listar/:userId', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	User.find({_id:req.params.userId}).exec(function(err, usuarios){

		if(err){
			
		} else {
			
			res.send(usuarios);
		}

	})

});

router.get('/listardesativados', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	User.where('isClient', 'false').where('availability', 'false').find(function(err, usuarios){

		if(err){
			
		} else {
			
			res.send(usuarios);
		}

	})

});
router.get('/listarapagar', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	Request.where('recebedorPagamento', 'aplicativo').where('pagamentoRepassado', 'false').find(function(err, requests){

		if(err){
			res.send('erro');
		} else {
			
			res.send(requests);
		}

	})

});
router.get('/listarareceber', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	Request.where('recebedorPagamento', 'motorista').where('taxaServicoPaga', 'false').find(function(err, requests){

		if(err){
			res.send('erro');
		} else {
			
			res.send(requests);
		}

	})

});

function emailgeral(email,texto){

var transporte = nodemailer.createTransport({
					  	service: 'Gmail', // Como mencionei, vamos usar o Gmail
					  	auth: {
					    user: 'guinchonamaoapp2@gmail.com', // Basta dizer qual o nosso usuário
					    pass: 'Guincho12345'             // e a senha da nossa conta
					  	} 
						});

						// Após configurar o transporte chegou a hora de criar um e-mail
						// para enviarmos, para isso basta criar um objeto com algumas configurações
						var email = {
						  from: 'guinchonamaoapp2@gmail.com', // Quem enviou este e-mail
						  to: email, // E-mail do administrador que cadastra os guinchos
						  subject: 'Cadastro do guincho',  // Um assunto bacana :-) 
						  html: texto // O conteúdo do e-mail
						};

						// Pronto, tudo em mãos, basta informar para o transporte
						// que desejamos enviar este e-mail
						transporte.sendMail(email, function(err, info){
						  if(err)
						    throw err; // Oops, algo de errado aconteceu.

					
						});



}

router.post('/inserir', function(req, res, next) {
	


	User.find({username:req.body.login},"username").exec(function(err, usuario){

		if(err){
			
		} else {


				if(usuario.length === 0 || usuario === ""){

		User.find({email:req.body.email},"email").exec(function(err, usuario){

			if(err){
				
			} else {


		if(usuario.length === 0 || usuario === ""){
													
						
const cipher = crypto.createCipher('aes192', req.body.senha);

var encrypted = '';
cipher.on('readable', () => {
  var data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {
  
  // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
});

cipher.write('some clear text data');
cipher.end();

		var dataatual = new Date();

		var datafinal = dataatual.toString();

		//var senha = encrypt(new Buffer(req.body.senha, 'utf8'));
		//buscar usuarios na collection usuarios
		new User({
		//perfil: req.body.perfil,
		username : req.body.login,
		password : encrypted , 
		isClient : req.body.isClient, 
		availability : false,  
		email : req.body.email, 
		//authData : 'teste', 
		emailVerified : false,  
		address : req.body.ender, 
		brand : req.body.marca,  
		model : req.body.modelo, 
		name : req.body.nome,
		phone : req.body.telefone, 
		createdAt : datafinal,  
		//updatedAt : new Date().getTime(), 
		//ACL : acl, 
		//lastPositionGeoPoint : 'teste' ,
		placauser: req.body.placauser,
		winchModels : req.body.modelguincho,
		trailerCapacity : req.body.trailerCapacity,									
		rntt : req.body.rntt,
		cep : req.body.cep,
		city : req.body.cidade,
		state : req.body.estado

		}).save(function(err, usuarios){

			if(err){
				
			
				
			} else {

			if(usuarios.isClient === false){
//contato@elitetransportesnet.com.br
var texto =	"RNTT = "+req.body.rntt+", Placa = "+req.body.placauser+", Modelo guincho = "+req.body.modelguincho+", Telefone = "+req.body.telefone+",E-mail = "+req.body.email+" - Para ativar esse guincheiro clique no link "+url+"/confirguincheiro/"+usuarios._id;
						  	emailgeral('contato@elitetransportesnet.com.br',texto);
									var texto2 =	"Para confirmar sua conta no Guincho na Mão clique no link:  "+url+"/confirmarconta/"+usuarios._id+"/"+req.body.email;

						  	emailgeral(req.body.email,texto2);
							res.send(usuarios);

							}	
							if(usuarios.isClient === true){

								var texto =	"Para confirmar sua conta no Guincho na Mão clique no link:  "+url+"/confirmarconta/"+usuarios._id+"/"+req.body.email;

						  	emailgeral(req.body.email,texto);
								res.send(usuarios);
						

							}				

						}

					});


					}else{

						usuarios = '{ "existe":"email" , "men": "E-mail já cadastrado !"}';	
						res.send(usuarios);

					}
				}

				});


			}else{

				usuarios = '{ "existe":"username" , "men": "Usuário já cadastrado !"}';	
				res.send(usuarios);

			}
		}

	});



});

	router.get('/confirguincheiro/:userId', function(req, res) {
       // lista as requisições quando "answered": false
  

      User.findOneAndUpdate({_id:req.params.userId}, { $set: { 
		
		isClient : false,
	        emailVerified : true,
		availability: true
	      
	
		} }, function (err, place) {
			var content = "";
			if(err){

				content = "";
				content = "Não foi possivel cadastrar o guincheiro";
					emailgeral('contato@elitetransportesnet.com.br',content);
  res.send("Não foi possivel cadastrar o guincheiro"+err);
			}

				if(place.length === 0 || place === ""){

				content = "";
				content = "Não foi possivel cadastrar o guincheiro";
						emailgeral('contato@elitetransportesnet.com.br',content);
                 res.send("Não foi possivel ativar essa conta do guincheiro");
					
					
			}else{


				content = "";
				content = "O guincheiro foi cadastrado Nome="+place.name+"e RNTT ="+place.rntt;
	             emailgeral('contato@elitetransportesnet.com.br',content);
				res.send("O guincheiro foi ativo e está proto para trabalhar, Nome="+place.name+"e RNTT ="+place.rntt);
			}

		});


		});


	router.get('/confirmarconta/:userId/:email', function(req, res) {
       // lista as requisições quando "answered": false
     
		
      User.findOneAndUpdate({_id:req.params.userId}, { $set: { 
		
		emailVerified : true
	
		} }, function (err, place) {
			var content = "";
			if(err){

				content = "";
				
				content = "Não foi possivel cadastrar o cliente";
				emailgeral(req.params.email,content);
				res.send("Não foi possivel confirmar o cliente");

			}

				if(place.length === 0 || place === ""){

				content = "";
				content = "Não foi possivel confirmar o cliente";
					emailgeral(req.params.email,content);
					 res.send("Não foi possivel confirmar o cliente");

			}else{


				content = "";
				content = "O cliente foi confirmado Nome="+place.name;
				emailgeral(req.params.email,content);
				 res.send("O cliente foi confirmado Nome="+place.name);

			}


});
	



			

		});


router.post('/obtemuser', function(req, res, next) {
      
	User.findById(req.body.iduser, function (err, usuario) {  
    if(err){
			
		} else {
			
			res.send(usuario);
		}
});


});


router.post('/editaruser', function(req, res, next) {
		

var dataatual = new Date();

var datafinal = Date();
	

		User.findOneAndUpdate({_id:req.body.iduser}, { $set: { 
		username : req.body.login,
		//password : req.body.senha, 
		email : req.body.email, 
		//authData : 'teste',  
		address : req.body.ender, 
		brand : req.body.marca,  
		model : req.body.modelo, 
		name : req.body.nome,
		phone : req.body.telefone, 
		updateAt : datafinal, 
		//ACL : acl, 
		//lastPositionGeoPoint : 'teste',
		winchModels : req.body.modelguincho,
		trailerCapacity : req.body.trailerCapacity,
		towCapacities : req.body.trailerCapacity,
		cep : req.body.cep,
		city : req.body.cidade,
		state : req.body.estado,
		rntt : req.body.rntt,
		placauser: req.body.placauser

	} }, function (err, place) {
 			
			res.send(place);
});
	
});


router.post('/deletaruser', function(req,res,mext){

//req.body.iduser
User.remove({ _id:req.body.iduser }, function(err) {
    if (!err) {
           
   
    }
    else {
         
    }
});

});

router.post('/inserirreq', function(req, res, next) {
	
	
 var Data = new Date();
var Fuso = Data.getTimezoneOffset()/60-3;
if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 var datafinal = Data;
	
	new Request({

		observations : req.body.obs, 
		email : req.body.emailreq, // email requisitante (busca no arquivo json)
		address : req.body.enderreq, // email requisitante (busca no arquivo json)
		name : req.body.nome, // nome requisitante (busca no arquivo json)
		phone : req.body.tel, // telefone requisitante (busca no arquivo json)
		placa: req.body.placa,
		situacao: req.body.situacao,
		createdAt :datafinal,
		updatedAt : datafinal,
		//ACL : acl, 
		price : req.body.preco,
		towCapacities : req.body.towcapacities,
		provider : 'teste', // guincheiro (busca quando o guincheiro aceitar)---
		date : datafinal, 
		from : req.body.iduser, // id requisitante (busca no arquivo json)
		formattedDate : 'teste',
		services : 'teste',
		paymentMethod : req.body.optpaga,
		answered : false, // guincheiro (quando o guincheiro aceitar)---
		inNegotiation : false,// guincheiro (quando o guincheiro aceitar)---
		useGPS : req.body.gps,
		clientPayed : req.body.pagou, // quando o cliente paga
		clientPaymentRequested : "teste",
		paymentOption : "teste", // quando abre a requisição
		lastPositionGeoPoint: req.body.local,
		enderCurto: req.body.curto,
		enderCompleto: req.body.completo,
		visivelcliente: true,
		visivelguincho: true,
		datadelete: '',
		enderCurtoDest: req.body.curtodest,
		enderCompletoDest: req.body.completodest,
		recebedorPagamento: '',
		pagamentoRepassado: '',
		idProprioMoipTaxa:''
		
		

	}).save(function(err, request){

		if(err){
			
			
		} else {
			
	       User.where('isClient', 'false').where('state',req.body.estado).find(function(err, listguincho){

		for(var i = 0; i < listguincho.length; i++ ){
			
			if(listguincho[i].device === 'android'){
				
				var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Nova solicitação !',
                            body: 'Nova solicitação de atendimento em sua área de atuação !'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [listguincho[i].regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
			}
			
		}

	});
			
	res.send(request);
				
		}
		
		

	});
	

});

	router.post('/listareq', function(req, res, next) {
       // lista as requisições quando "answered": false
		var name = req.body.estado;
		
	Request.where('inNegotiation', 'false').where('visivelcliente', 'true').where('visivelguincho', 'true').find({enderCurto: {
                         $regex: new RegExp(name, "ig")
                     }
			},function(err, listrequest){

		if(err){
		
		} else {
			
			res.send(listrequest);
		}

	}).sort([['createdAt', 'descending']]);
			
			

		});


	router.post('/listarpedidos', function(req, res, next) {
       // lista as requisições quando "answered": false
	Request.where('from', req.body.iduser).where('visivelcliente', 'true').find(function(err, listpedidos){

		if(err){
			
		} else {
			
			res.send(listpedidos);
		}

	}).sort([['createdAt', 'descending']]);
			
			

		});

	
router.post('/atendidosguincho', function(req, res, next) {
       // lista as requisições quando "provider"= iduser
	Request.where('provider', req.body.iduser).where('visivelguincho', 'true').find(function(err, listatend){

		if(err){
			
		} else {
		
			res.send(listatend);
		}

	}).sort([['createdAt', 'descending']]);
		});


router.post('/obtemreq', function(req, res, next) {
      
	Request.findById(req.body.idreq, function (err, request) {  
    if(err){
		
		} else {
		
			res.send(request);
		}
});


});

router.post('/escolherreq', function(req, res, next) {

var dataatual = new Date();

var datafinal = dataatual.toString();
	
	var precosonum = req.body.preco;
	var precox = precosonum.toString();
	var precofinal = precox.replace(/[^0-9]+/g,'');
	
	
	var porcentagem = 20/100;
        var percent = precofinal * porcentagem;

	var percentfinal = percent;
	var taxaServico = percentfinal;
	
	var valorrepassefinal = precofinal - percent;
	var valorRepasse = valorrepassefinal;
	
	
	new Service({


		createdAt :datafinal,  
		price : precofinal,
		request : req.body.idreq,
		date : datafinal, 
		to : req.body.iduser, // id guincheiro logado (busca no arquivo json)
		//formattedDate : 'teste', //insere automatico
		answered : false, 
		clientPayed : false, 
		clientPaymentRequested : false,
		paymentOption : "teste", 
		clientAccepted: false,
		providerAccepted: false,
		state: "",
		lastPositionGeoPoint: req.body.local,
		enderCurto: req.body.curto,
		enderCompleto: req.body.completo,
		nomeguincho: req.body.guincheiro,
		telefoneguincho: req.body.telguincho,
		valorRepasse: valorRepasse,
		taxaServico: taxaServico,
		taxaServicoPaga: false,
		pagamentoRepassado: false,
		recebedorPagamento: '',
		pagamentoRepassado: '',
		idProprioMoipTaxa:''

	}).save(function(err, service){

		if(err){
			
		} else {
			
			res.send(service);
		}

	});

		// o id é req.body.idreq e o provider req.body.iduser
	Request.findOneAndUpdate({_id: req.body.idreq}, { $set: {
		
		valorRepasse: valorRepasse,
		taxaServico: taxaServico,
		taxaServicoPaga: false,
		pagamentoRepassado: false,
		inNegotiation: true,
		provider: req.body.iduser  
	
	} }, function (err, place) {
	
			
				User.findOne({ '_id': place.from },  function (err, person) {
					 if (err) {return handleError(err);}
				
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',
			

		   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Sua solicitação foi escolhida !',
                            body: 'Um guincho disponivel'
                        }
                    }
		 }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [person.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
					}

		});
	
		
		
});


// manda um push

});


router.post('/rejeitarreq', function(req, res, next) {

	
	Service.remove({ request:req.body.idreq }, function(err){

		if(err){
			
		} else {
			
			
		}

	});
	
	

		Request.findOne({_id:req.body.idreq},  function (err, request) {
			
			res.send(request);
		if(req.body.iduser === request.provider){
		
			
		User.findOne({ '_id': request.from },  function (err, person) {
					 if (err) {return handleError(err);}
				
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Serviço rejeitado pelo guincho !',
                            body: 'Serviço rejeitado pelo guincho !'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [person.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
					}
					//else{
						

						//APN
					//	}

		});
				
				
		
		}
			
		
	
		if(req.body.iduser === request.from){
		
		
		User.findOne({ '_id': request.provider },  function (err, person) {
					 if (err) {return handleError(err);}
				
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Serviço rejeitado pelo cliente !',
                            body: 'Serviço rejeitado pelo cliente !'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [person.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
					}else{
						

						
						//APN
						}

		});
			
			}
		
			});
		
		


		// o id é req.body.idreq 
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 
		
		inNegotiation: false,
		provider: "" ,
		answered: false
	
	} }, function (err, place) {

		
		
		
});


// manda um push

});

router.post('/aceitarreq', function(req, res, next) {

	
	Service.findOneAndUpdate({ request:req.body.idreq }, { $set: { 
		
		clientAccepted: true ,
		providerAccepted: true ,
		state: 'Aceite'
	
	} }, function(err,placeserv){

		if(err){
			
		} else {
			
			
		}

	});
	

		// o id é req.body.idreq 
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { answered: true  } }, function (err, place) {

		
		User.findOne({ '_id': place.provider },  function (err, person) {
					 if (err) {return handleError(err);}
				
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',
			  data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'O cliente aceitou sua solicitação !',
                            body: 'O cliente aceitou sua solicitação !'
                        }
                    },
                    payload: 'O cliente aceitou sua solicitação !'
                }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [person.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
					}else{
				
						
						
					//APN
					}

		});
		
		
		  res.send(place);
		
});


// manda um push

});


router.post('/fecharreq', function(req, res, next) {

	
	Service.findOneAndUpdate({ _id:req.body.idserv }, { $set: {
		
		paymentOption: req.body.pagamento,
		formattedDate:new Date().getTime() ,
		clientAccepted: true,
		providerAccepted: true ,
		state: 'Pago'
	
	} }, function(err,placeserv){

		if(err){
			
		} else {	
	
	Request.findOneAndUpdate({_id:placeserv.request}, { $set: { requisicaoFinalizada: true , service: req.body.servico,formattedDate:new Date().getTime()  } }, function (err, place) {

		User.findOne({ _id: place.from },  function (err, person) {
					 if (err) {return handleError(err);}
				
				
					var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Sua requisição foi fechada pelo guincho !',
                            body: 'Sua requisição foi fechada pelo guincho !'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [person.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				});
					
	

		});
		
		
		
	});

		res.send(placeserv);	
		}

		  
});


		

});

router.post('/deletarreq', function(req,res,next){
	
	var data = new Date().getTime();
	
		   
		   
			
			Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 
				
				visivelcliente: false,
				datadelete: data
			
			} }, function (err, place) {
			
		res.send(place);
	});

	
	
	
	
// manda um push

});

router.post('/deletarreqguincho', function(req,res,next){
	
	var data = new Date().getTime();
		
			
				Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 
					
					visivelguincho: false, 
					datadelete: data
				
				} }, function (err, place) {
		
		res.send(place);
	});
	
	
// manda um push

});


router.post('/obtemserv', function(req, res, next) {
      
	Service.findById(req.body.idserv, function (err, service) {  
    if(err){

		} else {

			res.send(service);
		}
});


});

router.post('/obtemservporreq', function(req, res, next) {
     
	Service.findOne({request:req.body.idreq}, function (err, service) {  
    if(err){
		
		} else {
		
			res.send(service);
		}
});


});


router.post('/enviarcod', function(req, res, next) {
      
	User.find({email :req.body.emailuser }, function (err, usuario) { 

    	if(err){

		

		} 
		if(usuario) {
	
		res.send(usuario);

		}

	});
	
});


router.post('/enviaremail', function(req, res, next) {
  


/** Sync */
function randomString(length, chars) {
  if (!chars) {
    throw new Error('Argument \'chars\' is undefined');
  }

  var charsLength = chars.length;
  if (charsLength > 256) {
    throw new Error('Argument \'chars\' should not have more than 256 characters'
      + ', otherwise unpredictability will be broken');
  }

  var randomBytes = crypto.randomBytes(length);
  var result = new Array(length);

  var cursor = 0;
  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % charsLength];
  }

  return result.join('');
}

/** Sync */
function randomAsciiString(length) {

  return randomString(length,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

}
		

		var ret = randomAsciiString(5);


User.findOneAndUpdate({email:req.body.email}, { $set: { codseg: ret } }, function (err, place) {
	 if(err){

		} 
	});

	
  var transporte = nodemailer.createTransport({
	  	service: 'Gmail', // Como mencionei, vamos usar o Gmail
	  	auth: {
	    user: 'guinchonamaoapp2@gmail.com', // Basta dizer qual o nosso usuário
	    pass: 'Guincho12345'             // e a senha da nossa conta
	  	} 
		});

		// Após configurar o transporte chegou a hora de criar um e-mail
		// para enviarmos, para isso basta criar um objeto com algumas configurações
		var email = {
		  from: 'guinchonamaoapp2@gmail.com', // Quem enviou este e-mail
		  to: req.body.email, // Quem receberá
		  subject: 'Recuperação de senha Guincho na Mão',  // Um assunto bacana :-) 
		  html: ret // O conteúdo do e-mail
		};

		// Pronto, tudo em mãos, basta informar para o transporte
		// que desejamos enviar este e-mail
		transporte.sendMail(email, function(err, info){
		  if(err)
		    throw err; // Oops, algo de errado aconteceu.

		});
	
});

router.post('/verificacod', function(req, res, next) {
      
	User.find({codseg :req.body.codseg }, function (err, usuario) { 

    	if(err){

		} 
		if(usuario) {
			
		res.send(usuario);

		}

	});
	
});

router.post('/resetsenha', function(req, res, next) {
	
	const cipher = crypto.createCipher('aes192', req.body.senha);

var encrypted = '';
cipher.on('readable', () => {
  var data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {

});

cipher.write('some clear text data');
cipher.end();

      	//var senhareset = encrypt(new Buffer(req.body.senha, 'utf8'));
	User.findOneAndUpdate({_id:req.body.iduser}, { $set: { password: encrypted } }, function (err, place) {
	 if(err){

		} 
	});
	
});

router.post('/pagarreq', function(req, res, next) {
	
	
	var precofinal = req.body.preco / 100;
	//var precofinal = parseFloat(precosonum);

var moip = new Moip({
  // token: 'M40Q9IS6RU4WADU5MDUB5LBJP1T29QOS',
 // key: 'J6LDRWDEBBEPWKJQUJUDHGXBBTGQWN6GBTRZS47J'
 
	token: 'ONXYBJGEEGHECHM4RHARTPDGMGMY2KXF',
    key: 'OP3X2H7QWYRLH79H2IBUSJYJY9DIKHP4POXV0GQZ',
   sandbox: true // defaults to false 

});

var idproprio =  new Date().getTime();
	
	var payload = {
    EnviarInstrucao: {
        InstrucaoUnica: {
            Razao: 'Pagamento guincho',
            IdProprio: idproprio,
            Valores: {
                Valor: {
                    $: { 'moeda': 'BRL' },
                    _: precofinal
                }
            }
		}
	    }
	};
 
	moip.createPayment(payload, function (err, response) {
    if (err) {

    } else {
       
    }
	});
	

	
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: {
		
		statusPagamento: '',
		price: req.body.preco,
		idProprioMoip: idproprio,
		recebedorPagamento: req.body.recebedor
	
	} }, function (err, place) {
  	

	});
	
   Service.findOneAndUpdate({_id:req.body.idserv}, { $set: {
	   
	   statusPagamento: '',
	   price: req.body.preco,
	   idProprioMoip: idproprio,
	   recebedorPagamento: req.body.recebedor
   
   } }, function (err, service) {  
    if(err){
			
		} else {
		
		
		}
});
	
	
	// This method has an alias: enviarInstrucaoUnica 
	moip.enviarInstrucaoUnica(payload, function (err, response) {
	    // ... 
		res.send(response);
	});
	
	
	
});

router.post('/pagarreqmotorista', function(req, res, next) {
	
	var precofinal = req.body.preco / 100;
	//var precofinal = parseFloat(precosonum);
 
var idproprio =  new Date().getTime();
	
	
	
	
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: {
		
		statusPagamento: 'Concluido',
		price: req.body.preco,
		idProprioMoip: idproprio,
		recebedorPagamento: req.body.recebedor
	
	} }, function (err, place) {

	});
	
   Service.findOneAndUpdate({_id:req.body.idserv},
			    { $set: {
				    statusPagamento: 'Concluido',
				    price: req.body.preco,
				    idProprioMoip: idproprio,
				    recebedorPagamento: req.body.recebedor 
			    
			    } }, function (err, service) {  
    if(err){

		} else {
		
		}
});
	
	

	res.send('ok');
	
});

router.post('/pedidospagosmotorista', function(req, res, next) {
	
	
 Request.where('provider', req.body.iduser)
	  .where('visivelguincho', 'true')
	  .where('taxaServicoPaga', 'false')
	  .where('recebedorPagamento', 'motorista')
	  .find(function(err, listatend){

		if(err){
		
		} else {
	
			    res.send(listatend);
		}


	}).sort([['createdAt', 'descending']]);	
	
	
		    	
	
});
router.post('/pedidospagosmotoristafinalizados', function(req, res, next) {
	
	
 Request.where('provider', req.body.iduser)
	  .where('visivelguincho', 'true')
	  .where('taxaServicoPaga', 'true')
	  .where('recebedorPagamento', 'motorista')
	  .find(function(err, listatend){

		if(err){
			
		} else {
	
			    res.send(listatend);
		}


	}).sort([['createdAt', 'descending']]);	
	
	
		    	
	
});

router.post('/pagarreqtaxa', function(req, res, next) {
	
	var precofinal = req.body.preco / 100;
	//var precofinal = parseFloat(precosonum);


var moip = new Moip({
   // token: 'IU6N4WWMO9IOSZFV3IKKUFO2PS2IPS0D',
   // key: 'I9CI77UW1P9SDO4FZEZCIIXIXAN8CIPICJ82MZMP',
  // sandbox: true // defaults to false 
    token: 'M40Q9IS6RU4WADU5MDUB5LBJP1T29QOS',
    key: 'J6LDRWDEBBEPWKJQUJUDHGXBBTGQWN6GBTRZS47J'
});
 
var idproprio =  new Date().getTime();
	
	var payload = {
    EnviarInstrucao: {
        InstrucaoUnica: {
            Razao: 'Pagamento taxa guincho',
            IdProprio: idproprio,
            Valores: {
                Valor: {
                    $: { 'moeda': 'BRL' },
                    _: precofinal
                }
            }
		}
	    }
	};
 
	moip.createPayment(payload, function (err, response) {
    if (err) {

    } else {

    }
	});
	
	
	
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: {
		
		idProprioMoipTaxa: idproprio
	
	} }, function (err, place) {
  

	});
	
   Service.findOneAndUpdate({_id:req.body.idserv}, { $set: {
	   
	  idProprioMoipTaxa: idproprio
   
   } }, function (err, service) {  
    if(err){
		} else {

		
		}
});
	
	

	// This method has an alias: enviarInstrucaoUnica 
	moip.enviarInstrucaoUnica(payload, function (err, response) {
	    // ... 
		res.send(response);
	});
	
	
	
});



router.post('/pedidospagosaplicativo', function(req, res, next) {
	
	
 Request.where('provider', req.body.iduser)
	  .where('visivelguincho', 'true')
	  .where('pagamentoRepassado', 'false')
	  .where('recebedorPagamento', 'aplicativo')
	  .find(function(err, listatend){

		if(err){

		} else {
		
			res.send(listatend);
		}


	}).sort([['createdAt', 'descending']]);	
	
	
		    	
	
});

router.post('/pedidospagosaplicativofinalizados', function(req, res, next) {
	
	
 Request.where('provider', req.body.iduser)
	  .where('visivelguincho', 'true')
	  .where('pagamentoRepassado', 'true')
	  .where('recebedorPagamento', 'aplicativo')
	  .find(function(err, listatend){

		if(err){
	
		} else {
		
			res.send(listatend);
		}


	}).sort([['createdAt', 'descending']]);	
	
	
		    	
	
});


router.post('/pagartotaltaxa', function(req, res, next) {
	
	var precofinal = req.body.preco / 100;
	//var precofinal = parseFloat(precosonum);


var moip = new Moip({
    token: 'M40Q9IS6RU4WADU5MDUB5LBJP1T29QOS',
    key: 'J6LDRWDEBBEPWKJQUJUDHGXBBTGQWN6GBTRZS47J',
    sandbox: false // defaults to false 
});
 
var idproprio =  new Date().getTime();
	
	var payload = {
    EnviarInstrucao: {
        InstrucaoUnica: {
            Razao: 'Pagamento guincho',
            IdProprio: idproprio,
            Valores: {
                Valor: {
                    $: { 'moeda': 'BRL' },
                    _: precofinal
                }
            }
		}
	    }
	};
 
	moip.createPayment(payload, function (err, response) {
    if (err) {

    } else {

    }
	});
	
	 Request.where('provider', req.body.iduser)
	  .where('visivelguincho', 'true')
	  .where('taxaServicoPaga', 'false')
	  .where('recebedorPagamento', 'motorista')
	  .find(function(err, listatend){

		if(err){

		} else {
	
			for(var i = 0; i < listatend.length; i++){
				
				Request.findOneAndUpdate({_id:listatend[i]._id}, { $set: {

					idProprioMoipTaxa: idproprio

				} }, function (err, place) {
					

				});
				
				Service.update({request:listatend[i]._id}, { $set: {
	   
	   idProprioMoipTaxa: idproprio
   
   } }, function (err, service) {  
    if(err){

		} else {

		
		}
});
			
			}
			
			    
			
		}


	}).sort([['createdAt', 'descending']]);	
	
	
// This method has an alias: enviarInstrucaoUnica 
	moip.enviarInstrucaoUnica(payload, function (err, response) {
	    // ... 
		res.send(response);
	});
	
	
	
});


router.get('/baixapagamento/:idReq', function(req, res, next) {
	var dataatual =  new Date().getTime();
	
	      Request.findOneAndUpdate({_id:req.params.idReq}, { $set: { 
		
		pagamentoRepassado : true,
		dataRepasse : dataatual
	
		} }, function (err, place) {
			
			if(err){

				res.send("Não foi possivel confirmar o pagamento");

			}else{

				 res.send("O pagamento foi confirmado");

			}


		});

});
module.exports = router;


		
