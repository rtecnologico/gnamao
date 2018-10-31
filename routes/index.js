var express = require('express');
var router = express.Router();
var User = require('../controller/usuarioController');
var User_old = require('../controller/usuariooldController');
var Request = require('../controller/requestController');
var Service = require('../controller/serviceController');
var Situacao = require('../controller/situacaoController');
var Cancelamento = require('../controller/cancelamentoController');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var Moip = require("moip");
var url = 'https://guinchonamao.herokuapp.com';





var gcm = require('node-gcm');
 router.get('/', function(req, res, next) {
	res.render('index', { title: 'teste' });
});
//cfbb0c8a59ca48bb9cb50a874701f1d2_v2 sandbox
//fbb2175719ff47be9330f9107164008f_v2
//fbb2175719ff47be9330f9107164008f_v2
	const moip = require('moip-sdk-node').default({
  accessToken: 'fbb2175719ff47be9330f9107164008f_v2',
  production: true
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
	

});

router.get('/getpaga', function(req, res, next) {
	
	emailgeral("rcsouza23@gmail.com","assunto","texto");
});	

router.get('/porce', function(req, res, next) {
	
      var porcentagem = 20/100;
     var percent = 35020 * porcentagem;
	var percentfinal = percent /100;
     
	        res.send(percentfinal);

});

router.get('/testenotificacao', function(req, res, next) {
	var apn = require('apn');
	var options = {
	token: {
		key: "APNsAuthKey_4CT9J4522K.p8",
		keyId: "4CT9J4522K",
		teamId: "9CJRFW89ZU",
	},
	production: false,
};
	var apnProvider = new apn.Provider(options);
var deviceToken = "518e991642d2974d11d32f6d88ee7fe1d0b1913f135c217716fc1adf2aac238c";
	var note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
note.payload = {'messageFrom': 'John Appleseed'};
note.topic = "com.herokuapp.guinchonamao";
	
	apnProvider.send(note, deviceToken).then( (result) => {
	// see documentation for an explanation of result
	});
					res.send('foi');

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
					
	
	
		emailgeral("financeiro@guinchonamao.com.br","Status pagamento Guincho na mão"+place.idProprioMoipTaxa,texto);
		
		User.findOne({_id:place.provider},function (err, provider) { 
	
	
		emailgeral(provider.email,"Status pagamento Guincho na mão",texto);
		
	
	        });
					
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
				
  	emailgeral("financeiro@guinchonamao.com.br","Status pagamento Guincho na mão"+place.idProprioMoipTaxa,texto);
		
		User.findOne({_id:place.provider},function (err, provider) { 
	
	
		emailgeral(provider.email,"Status pagamento Guincho na mão",texto);
		
	
	        });

	});
	
   Service.findOneAndUpdate({idProprioMoipTaxa:req.body.id_transacao}, { $set: {
	   
	  			dataTaxaServicoPaga: datafinal,
				taxaServicoPaga: taxapaga 
   
   } }, function (err, service) {  

	  
    });
			
			
		
			
			}else{
				
		Request.findOne({idProprioMoip:req.body.id_transacao},function (err, requestx) { 
	
		User.findOne({_id:requestx.from},function (err, usuario) { 
	
	
		emailgeral(usuario.email,"Status pagamento Guincho na mão",texto);
			if(usuario.device === 'android'){
				
				var message = new gcm.Message({
					 collapseKey: 'demo',  

			   data: {
				
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Status pagamento '+statuspaga,
                            body: texto
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [usuario.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
			}
	
	        });
		
		User.findOne({_id:requestx.provider},function (err, provider) { 
	
	
		emailgeral(provider.email,"Status pagamento Guincho na mão",texto);
			if(provider.device === 'android'){
				
				var message = new gcm.Message({
					 collapseKey: 'demo',  

			   data: {
				
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Status pagamento '+statuspaga,
                            body: texto
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [provider.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
			}
	
	        });
	
	
	});

	Request.findOneAndUpdate({idProprioMoip:req.body.id_transacao}, { $set: { 
		
		dataTaxaServicoPaga: datafinal,
		clientPayed : taxapaga,
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
	
/*const crypto = require('crypto');
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
cipher.end();*/
const crypto = require('crypto');

const secret = req.body.senha;
const encrypted = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
	

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
router.get('/listarantigos', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	User_old.find(function(err, usuarios){

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
router.get('/listarusuarios', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	User.find(function(err, usuarios){

		if(err){
			
		} else {
			
			res.send(usuarios);
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

router.get('/listartaxasrecebidas', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	Request.where('recebedorPagamento', 'motorista').where('taxaServicoPaga', 'true').find(function(err, requests){

		if(err){
			res.send('erro');
		} else {
			
			res.send(requests);
		}

	})

});

router.get('/listataxaspagas', function(req, res, next) {
	
	//buscar usuarios na collection usuarios

	Request.where('recebedorPagamento', 'aplicativo').where('pagamentoRepassado', 'true').find(function(err, requests){

		if(err){
			res.send('erro');
		} else {
			
			res.send(requests);
		}

	})


});

function emailgeral(email,assunto,texto){


	const nodemailer = require('nodemailer');

	
	const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
  	   user: 'guinchonamaoapp2@gmail.com', // Basta dizer qual o nosso usuário
	    pass: 'Guincho12345'             // e a senha da nossa conta
  },
  tls: { rejectUnauthorized: false }
});

		const mailOptions = {
  from: 'guinchonamaoapp2@gmail.com',
  to: email,
  subject: assunto,
  text: texto
};

		transporter.sendMail(mailOptions, function(error, info){
  if (error) {
   // res.send(error);
  } else {
   // res.send('Email enviado: ' + info.response);
  }
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
													
	const crypto = require('crypto');
const secret = req.body.senha;
const encrypted = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');

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
		state : req.body.estado,
		cpf : req.body.cpf,
		banco : req.body.banco,
		titularConta : req.body.titularconta,
		tipoConta : req.body.tipoconta,
		agenciaBancaria : req.body.agenciabancaria,
		contaBancaria : req.body.contabancaria,
		opBancaria : req.body.opbancaria

		}).save(function(err, usuarios){

			if(err){
				
			
				
			} else {

			if(usuarios.isClient === false){
//contato@elitetransportesnet.com.br
var texto =	"RNTT = "+req.body.rntt+", Placa = "+req.body.placauser+", Modelo guincho = "+req.body.modelguincho+", Telefone = "+req.body.telefone+",E-mail = "+req.body.email+" - Para ativar esse guincheiro clique no link "+url+"/confirguincheiro/"+usuarios._id;
						  	emailgeral('cadastro@guinchonamao.com.br','Ativar guincheiro',texto);
									var texto2 =	"Para confirmar sua conta no Guincho na Mão clique no link:  "+url+"/confirmarconta/"+usuarios._id+"/"+req.body.email;

						  	emailgeral(req.body.email,"Confirmar conta",texto2);
							res.send(usuarios);

							}	
							if(usuarios.isClient === true){

								var texto =	"Para confirmar sua conta no Guincho na Mão clique no link:  "+url+"/confirmarconta/"+usuarios._id+"/"+req.body.email;

						  	emailgeral(req.body.email,"Confirmar conta",texto);
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
	      var contentuser = "";
			if(err){

				content = "";
				content = "Não foi possivel cadastrar o guincheiro";
					emailgeral('cadastro@guinchonamao.com.br','Ativar guincho',content);
  res.send("Não foi possivel cadastrar o guincheiro"+err);
			}

				if(place.length === 0 || place === ""){

				content = "";
				content = "Não foi possivel cadastrar o guincheiro";
						emailgeral('cadastro@guinchonamao.com.br','Ativar guincho',content);
                 res.send("Não foi possivel ativar essa conta do guincheiro");
					
					
			}else{

				contentuser = "";
				contentuser = "O guincheiro foi ativado Nome="+place.name+"e RNTT ="+place.rntt+" e já pode atender solicitações de guincho, realize o login novamente";
				content = "";
				content = "O guincheiro foi ativado Nome="+place.name+"e RNTT ="+place.rntt+" e já pode atender solicitações de guincho";
	             emailgeral('cadastro@guinchonamao.com.br','Ativar guincho',content);
				emailgeral(place.email,'Ativação do guincho',contentuser);
				res.send("O guincheiro foi ativo e está pronto para trabalhar, Nome="+place.name+"e RNTT ="+place.rntt);
				
				
				if(place.device === 'android'){
				
				var message = new gcm.Message({
					 collapseKey: 'demo',  

			   data: {
				
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Ativação de conta',
                            body: 'Sua conta esta ativa, você já pode atender solicitações de guincho'
                        }
                    }
			   }
				});

		// Set up the sender with you API key, prepare your recipients' registration tokens. 
		var sender = new gcm.Sender('AAAA3mpxyus:APA91bEV-2X0RiHrE198rq-W_vQiKOZ1Ibrt1ExZFAUp1LXuKx0KyHJvR1UWXiEg949y5tANmyQ7BhPvGHiSoOsFNe3xv8n63sMEFoZAfr7TBklTUQ0A48tzDoRU0m4pZcinXk5BgP_r');
		var regTokens = [place.regid];

				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				}); 
					
			}
							
				
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
				emailgeral(req.params.email,'Confirmação conta',content);
				res.send("Não foi possivel confirmar o cliente");

			}

				if(place.length === 0 || place === ""){

				content = "";
				content = "Não foi possivel confirmar o cliente";
					emailgeral(req.params.email,'Confirmação conta',content);
					 res.send("Não foi possivel confirmar o cliente");

			}else{


				content = "";
				content = "O cliente foi confirmado Nome="+place.name;
				emailgeral(req.params.email,'Confirmação conta',content);
				 res.send("O cliente foi confirmado Nome="+place.name);

			}


});
	



			

		});


router.get('/obtemuser/:idUser', function(req, res, next) {
      
	User.findById(req.params.idUser, function (err, usuario) {  
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
		towCapacities : req.body.towCapacities,
		cep : req.body.cep,
		city : req.body.cidade,
		state : req.body.estado,
		rntt : req.body.rntt,
		placauser: req.body.placauser,
		availability : req.body.avaliado,  
		emailVerified : req.body.emailverificado,
		cpf : req.body.cpf,
		banco : req.body.banco,
		titularConta : req.body.titularconta,
		tipoConta : req.body.tipoconta,
		agenciaBancaria : req.body.agenciabancaria,
		contaBancaria : req.body.contabancaria,
		opBancaria : req.body.opbancaria,
		listaNegra :  req.body.listanegra

	} }, function (err, place) {
 			
			res.send(place);
});
	
});


router.post('/deletaruser', function(req,res,mext){

//req.body.iduser
User.remove({ _id:req.body.iduser }, function(err) {
    if (!err) {
           
   res.send("");
    }
    else {
         res.send("");
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
		
	
});
	
	
			// o id é req.body.idreq e o provider req.body.iduser
	Request.findOne({_id: req.body.idreq}, function (err, request) {
		
	User.findOne({ _id: request.from },  function (err, person) {
				
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

		var Data = new Date();
		var Fuso = Data.getTimezoneOffset()/60-3;
		if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 		var datafinal = Data;

		Request.findOne({_id:req.body.idreq},  function (err, request) {
			
	Service.remove({ request:request._id }, function(err){

		if(err){
			
		} else {
		

		new Cancelamento({
			
			tipo :'cancelamento',
			request :req.body.idreq,
			averiguado : false,
			autorCancelamento :req.body.iduser,
			usuario :request.from,
			guincho :request.provider,
			dataHoraRequest :request.createdAt,
			createdAt :datafinal,
			updatedAt : datafinal

		}).save(function(err, request){


		

		});
			
		}

	});
		 
		if(req.body.iduser === request.provider){
			
		User.findOne({ '_id': request.provider },  function (err, users) {
				
				if (typeof users.qtdCancelamentos !== 'undefined') {
				var qtdCancelx = users.qtdCancelamentos;
			      var qtdCancel = users.qtdCancelamentos  + 1;
			}else{
			var qtdCancel = 1;
			}
					
			User.findOneAndUpdate({ '_id': request.provider }, { $set: {

				qtdCancelamentos: qtdCancel  
	
			} }, function (err, place) {
		
	
			});
				
			});
		
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
			
			User.findOne({ '_id': request.from },  function (err, users) {
				
				if (typeof users.qtdCancelamentos !== 'undefined') {
				var qtdCancelx = users.qtdCancelamentos;
			      var qtdCancel = users.qtdCancelamentos  + 1;
			}else{
			var qtdCancel = 1;
			}
					
					
			User.findOneAndUpdate({ '_id': request.from }, { $set: {

				qtdCancelamentos: qtdCancel  
	
			} }, function (err, place) {
		
	
			});
				
			});
		
		
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
		state: 'Aceito'
	
	} }, function(err,placeserv){

		if(err){
			
		} else {
			
			
		}

	});
	

		// o id é req.body.idreq 
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { answered: true  } }, function (err, place) {

		
		User.findOne({ _id: place.provider },  function (err, person) {
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
	
	Request.findOneAndUpdate({_id:placeserv.request}, { $set: { requisicaoFinalizada: true , 
								   service: req.body.servico,
								   formattedDate:new Date().getTime()  
								  
								  } }, function (err, place) {

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
	
		   
		   	var Data = new Date();
		var Fuso = Data.getTimezoneOffset()/60-3;
		if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 		var datafinal = Data;
			

			Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 
				
				visivelcliente: false,
				datadelete: data
			
			} }, function (err, request) {
			
			User.findOne({ '_id': request.provider },  function (err, person) {
			
		
						if (typeof person.qtdExcluidos !== 'undefined') {
				var qtdExcluirx = person.qtdExcluidos;
				var qtdExcluir = qtdExcluirx + 1;
			}else{
			var qtdExcluir = 1;
			}
				

				User.findOneAndUpdate({ '_id': request.from }, { $set: {

					qtdExcluidos: qtdExcluir  

				} }, function (err, place) {


				});
			
	
			});
			
					 
	
	if(req.body.perfiluser == true){
	   
		User.findOne({ '_id': request.from },  function (err, users) {
				
				if (typeof users.qtdExcluidos !== 'undefined') {
				var qtdExcluirx = users.qtdExcluidos;
				var qtdExcluir = qtdExcluirx + 1;
			}else{
			var qtd = 1;
			}
					
			User.findOneAndUpdate({ '_id': request.from }, { $set: {

				qtdExcluidos: qtd  
	
			} }, function (err, place) {
		
	
			});
				
			});
		
	   var autor = request.from;
	   
	   }else{
		   
		   	User.findOne({ '_id': request.provider },  function (err, users) {
				
				if (typeof users.qtdExcluidos !== 'undefined') {
				var qtd = users.qtdExcluidos++;
			}else{
			var qtd = 1;
			}
					
			User.findOneAndUpdate({ '_id': request.provider }, { $set: {

				qtdExcluidos: qtd  
	
			} }, function (err, place) {
		
	
			});
				
			});
		   
	    var autor = request.provider;
	   
	   }
		
			new Cancelamento({

			tipo :'exclusao',
			request :req.body.idreq,
			averiguado : false,
			autorCancelamento :autor,
			usuario :request.from,
			guincho :request.provider,
			dataHoraRequest :request.createdAt,
			createdAt :datafinal,
			updatedAt : datafinal

		}).save(function(err, cancel){


		

		});
				
				
		res.send(request);
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


User.update({email:req.body.emailuser}, { codseg: ret },{multi:true}, function (err, place) {
	 if(err){

			res.send(err);

		} else{
		
		emailgeral(req.body.emailuser,"Recuperação de senha","Seu código de confirmação de mudança é :"+ret);
		res.send(place);
		
		}
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
	
/*	const crypto = require('crypto');
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
cipher.end(); */
	const crypto = require('crypto');
const secret = req.body.senha;
const encrypted = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
	
      	//var senhareset = encrypt(new Buffer(req.body.senha, 'utf8'));
	User.findOneAndUpdate({_id:req.body.iduser}, { $set: { password: encrypted } }, function (err, place) {
	 if(err){

		} 
		res.send(place);
	});
	
});

router.post('/resetsenhalogoff', function(req, res, next) {
	

	const crypto = require('crypto');
const secret = req.body.senha;
const encrypted = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
	

		 User.findOneAndUpdate({email:req.body.emailcod}, {$set:{password:encrypted}}, {new: true}, function(err, doc){
    if(err){
        res.send(err);
    }

    res.send(doc);
});
	
});

router.post('/pagarreq', function(req, res, next) {
	
	
	var precofinal = req.body.preco;
	//var precofinal = parseFloat(precosonum);

var idproprio =  new Date().getTime();
	
	 moip.order.create({
    ownId: '1521656695',
    items: [{
        product: 'Guincho atendimento',
        quantity: 1,
        detail: 'Sem mais informacoes',
        price: precofinal
    }],
		 customer: {
        ownId: '1521656726',
        fullname: 'Aplicativo Guinchona mão',
        email: 'noreply@email.com',
        birthDate: '1988-12-30',
        taxDocument: {
            type: 'CPF',
            number: '22222222222'
        },
        phone: {
            countryCode: '55',
            areaCode: '11',
            number: '66778899'
        }
    }
   
}).then((response) => {
		 
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
	 var arquivo = {
		 
	btn1:{"link":response.body._links.checkout.payCreditCard.redirectHref, "status": true, "texto":"Cartão Crédito"},
	btn2:{"link":response.body._links.checkout.payBoleto.redirectHref, "status": false, "texto":"Boleto"},
	btn3:{"link":response.body._links.checkout.payOnlineBankDebitItau.redirectHref, "status": true, "texto":"Débito"}
		
			  };
    res.send(arquivo)
}).catch((err) => {
   res.send(err)
})


});

router.post('/pagarreqmotorista', function(req, res, next) {
	
	var precofinal = req.body.preco;
	//var precofinal = parseFloat(precosonum);
 
var idproprio =  new Date().getTime();
	 var Data = new Date();
var Fuso = Data.getTimezoneOffset()/60-3;
if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 var datafinal = Data;

		Request.findOne({_id:req.body.idreq}, function (err, request) {
		
			if(request.provider){
		
			
		User.findOne({ _id: request.from },  function (err, person) {
					 if (err) {return handleError(err);}
				emailgeral(person.email,"Pagamento Guincho na Mão","O cliente escolheu pagamento ao motorista, confirme o pagamento antes de finalizar a solicitação");
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Pagamento ao motorista !',
                            body: 'O cliente escolheu pagar ao motorista, verifique o pagamento antes de finalizar a solicitação.'
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
			
		
	
		if(request.from){
		
		
		User.findOne({ '_id': request.provider },  function (err, person) {
					 if (err) {return handleError(err);}
				
				if(person.device === 'android'){
					var message = new gcm.Message({
					 collapseKey: 'demo',


			   data: {
                    notification: {
                        alert: {
				 sound: 'default',
                            title: 'Pagamento Guincho na mão',
                            body: 'Repasse o valor ao motorista do guincho, obrigado!'
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
	
	
	
   Service.findOneAndUpdate({_id:req.body.idserv},
			    { $set: {
				    statusPagamento: 'Concluido',
				    price: req.body.preco,
				    idProprioMoip: idproprio,
				    dataPagamento: datafinal,
				    recebedorPagamento: req.body.recebedor 
			    
			    } }, function (err, service) {  
    if(err){

		} else {
		
		}
});
	
	Request.findOneAndUpdate({_id:req.body.idreq}, { $set: {
		
		statusPagamento: 'Concluido',
		price: req.body.preco,
		idProprioMoip: idproprio,
		recebedorPagamento: req.body.recebedor
	
	} }, function (err, place) {
		
		res.send(place);

	});
	
	
	
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
	
	var precofinal = req.body.preco;
	//var precofinal = parseFloat(precosonum);

	//var precofinal = req.body.preco;
	//var precofinal = parseFloat(precosonum);

var idproprio =  new Date().getTime();
	
	 moip.order.create({
    ownId: '1521656695',
    items: [{
        product: 'Guincho atendimento',
        quantity: 1,
        detail: 'Sem mais informacoes',
        price: precofinal
    }],
		 customer: {
        ownId: '1521656726',
        fullname: 'Aplicativo Guinchona mão',
        email: 'noreply@email.com',
        birthDate: '1988-12-30',
        taxDocument: {
            type: 'CPF',
            number: '22222222222'
        },
        phone: {
            countryCode: '55',
            areaCode: '11',
            number: '66778899'
        }
    }
   
}).then((response) => {
		 
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
	
	

	 var arquivo = {
		 
	btn1:{"link":response.body._links.checkout.payCreditCard.redirectHref, "status": true, "texto":"Cartão Crédito"},
	btn2:{"link":response.body._links.checkout.payBoleto.redirectHref, "status": true, "texto":"Boleto"},
	btn3:{"link":response.body._links.checkout.payOnlineBankDebitItau.redirectHref, "status": true, "texto":"Débito"}
		
			  };
    res.send(arquivo)
}).catch((err) => {
   res.send(err)
})
	
	

	
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

	var precofinal = req.body.preco;
	

var idproprio =  new Date().getTime();
	
	 moip.order.create({
    ownId: '1521656695',
    items: [{
        product: 'Guincho atendimento',
        quantity: 1,
        detail: 'Sem mais informacoes',
        price: precofinal
    }],
		 customer: {
        ownId: '1521656726',
        fullname: 'Aplicativo Guinchona mão',
        email: 'noreply@email.com',
        birthDate: '1988-12-30',
        taxDocument: {
            type: 'CPF',
            number: '22222222222'
        },
        phone: {
            countryCode: '55',
            areaCode: '11',
            number: '66778899'
        }
    }
   
}).then((response) => {
		 
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
	
	 var arquivo = {
		 
	btn1:{"link":response.body._links.checkout.payCreditCard.redirectHref, "status": true, "texto":"Cartão Crédito"},
	btn2:{"link":response.body._links.checkout.payBoleto.redirectHref, "status": true, "texto":"Boleto"},
	btn3:{"link":response.body._links.checkout.payOnlineBankDebitItau.redirectHref, "status": true, "texto":"Débito"}
		
			  };
    res.send(arquivo)
}).catch((err) => {
   res.send(err)
})
	
	

	
	
});


router.get('/baixapagamento/:idReq', function(req, res, next) {
	var dataatual =  new Date().getTime();	
	      	
	Request.findById(req.params.idReq, function (err, request) {  
    		if(err){
		
		} else {
				
			if(request.pagamentoRepassado == true){
			     var statuspaga = false;
			}else{
				var statuspaga = true;
			}
			Request.findOneAndUpdate({_id:req.params.idReq}, { $set: { 	
				pagamentoRepassado : statuspaga,
				dataRepasse : dataatual
				} }, function (err, place) {			
			if(err){
				res.send("Não foi possivel confirmar o pagamento");
			}else{
				 res.send("O pagamento foi confirmado");
			}
			});
			
		}
});


});

router.post('/avaliaratendimento', function(req, res, next) {
	
	
	
	      Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 
		
		avaliacaoAtendimento : req.body.avaliacao,
		      avaliado: true
	
		} }, {new: true}, function (err, request) {
			
			if(err){
				
				res.send("erro");

			}else{

				Request.where('provider', request.provider)
		.where('avaliado', 'true')
		.find(function (err, requestAll) { 
	
				var  totalavaliacao = 0;
		  for(var i = 0; i < requestAll.length; i++) {
  				  
			 var avaliacaoreq = parseInt(requestAll[i].avaliacaoAtendimento);
			 var totalavaliacao = avaliacaoreq + totalavaliacao;
			  
 			}
		 var x = parseInt(requestAll.length);
		 var y = parseInt(totalavaliacao);
		var avaliacaofinal = y / x;
		var avaliacaofinal = parseFloat(avaliacaofinal.toFixed(1));
			User.update({_id:request.provider}, { 

			avaliacaoSatisfatoria : avaliacaofinal

			}, {new: true}, function (err, placex) {


			});

	
		});
		res.send(request);		

			}


		});

});

router.get('/plataforma/obtemreq/:idReq', function(req, res, next) {
      
	Request.findById(req.params.idReq, function (err, request) {  
    if(err){
		
		} else {
				
			res.send(request);
		}
});


});

router.get('/plataforma/listarreq', function(req, res, next) {
      
	Request.find(function(err, request){

		if(err){
			
		} else {
			
			res.send(request);
		}

	})
});

router.post('/plataforma/editarreq', function(req, res, next) {
		
var dataatual = new Date();

var datafinal = Date();
	

		Request.findOneAndUpdate({_id:req.body.idreq}, { $set: { 

		email : req.body.email, 
		enderCompleto : req.body.endereco, 		
		phone : req.body.telefone, 
		updateAt : datafinal, 
		towCapacities : req.body.tipoveiculo,		
		placa: req.body.placa,
		price: req.body.preco,
		answered: req.body.respondido,
		enderCompletoDest: req.body.enderecodestino,
		inNegotiation: req.body.negociacao,
		recebedorPagamento: req.body.recebedor,
		pagamentoRepassado: req.body.pagamentorepassado,
		requisicaoFinalizada: req.body.requisicaofinalizada,
		observations: req.body.obs,
		avaliacaoAtendimento: req.body.avaliacao,
		cpf : req.body.cpf,
		banco : req.body.banco,
		titularConta : req.body.titularconta,
		tipoConta : req.body.tipoconta,
		agenciaBancaria : req.body.agenciabancaria,
		contaBancaria : req.body.contabancaria,
		opBancaria : req.body.opbancaria


	} }, function (err, request) {
 			
			res.send(request);
});
	
});


router.post('/plataforma/inserirreq', function(req, res, next) {
	
	
 var Data = new Date();
var Fuso = Data.getTimezoneOffset()/60-3;
if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 var datafinal = Data;
	
	new Request({

		email : req.body.email, 
		enderCompleto : req.body.endereco, 		
		phone : req.body.telefone, 
		updateAt : datafinal, 
		towCapacities : req.body.tipoveiculo,
		name : req.body.nome, // nome requisitante (busca no arquivo json)		
		placa: req.body.placa,
		price: "",
		enderCompletoDest: req.body.enderecodestino,
		inNegotiation:  false,
		recebedorPagamento: "",
		pagamentoRepassado:  false,
		requisicaoFinalizada:  false,
		observations: req.body.obs,
		avaliacaoAtendimento: req.body.avaliacao,
		createdAt :datafinal,
		updatedAt : datafinal,
		provider : 'teste', // guincheiro (busca quando o guincheiro aceitar)---
		date : datafinal, 
		from : req.body.iduser, // id requisitante (busca no arquivo json)
		formattedDate : 'teste',
		services : 'teste',
		paymentMethod : "",
		answered : false, // guincheiro (quando o guincheiro aceitar)---
		inNegotiation : false,// guincheiro (quando o guincheiro aceitar)---
		useGPS : "",
		clientPayed : "false", // quando o cliente paga
		clientPaymentRequested : "teste",
		paymentOption : "teste", // quando abre a requisição
		lastPositionGeoPoint: "",
		enderCurto: req.body.endereco,
		address : req.body.endereco, // email requisitante (busca no arquivo json)
		requisicaoFinalizada:false,
		paymentMethod : "",
		visivelcliente: true,
		visivelguincho: true,
		datadelete: '',
		
		enderCurtoDest: req.body.enderecodestino,
	situacao: req.body.situacao,
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


router.get('/listarcancelamentos', function(req, res, next) {
	
	Cancelamento.where('averiguado', 'false').find(function(err, cancel){
		
			res.send(cancel);
		

	});	
});





router.get('/averiguarcancelamento/:idCancel', function(req, res, next) {
	
	
 var Data = new Date();
var Fuso = Data.getTimezoneOffset()/60-3;
if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 var datafinal = Data;
	

		Cancelamento.findOneAndUpdate({_id:req.params.idCancel}, { $set: {
		averiguado: true,
		dataAveriguado: datafinal
		
		}} , function (err, cancel) {
		
			
			User.findOne({ '_id': cancel.autorCancelamento },  function (err, users) {
				
				if (typeof users.qtdCancelamentos !== 'undefined') {
				var qtdCancelx = users.qtdCancelamentos;
			      var qtdCancel = users.qtdCancelamentos  - 1;
			}
					
			User.findOneAndUpdate({ '_id': cancel.autorCancelamento }, { $set: {

				qtdCancelamentos: qtdCancel  
	
			} }, function (err, place) {
		
	
			});
				
			});
			
			
			
	res.send(cancel);
		}); 
			
	
});

router.get('/obtemcancelamento/:idCancel', function(req, res, next) {
      
	Cancelamento.findById(req.params.idCancel, function (err, cancel) {  
    if(err){
			
		} else {
			
			res.send(cancel);
		}
});


});

router.get('/cancelamentosexcedidos', function(req, res, next) {
	
	User.where('qtdCancelamentos').gte(5).find(function(err, users){
		
			res.send(users);
		
	});	
});

	

router.get('/listarguinchos', function(req, res, next) {
	
	User.where('isClient','false').find(function(err, users){
		
			res.send(users);
		
	});	
});

router.get('/requisicaoporusuario/:idUser', function(req, res, next) {
	
	Request.where('provider',req.params.idUser)
	  .where('taxaServicoPaga', 'false')
	  .where('recebedorPagamento', 'motorista')
		.find(function(err, request){

		if(err){
			
		} else {
			
			res.send(request);
		}

	});
});

router.get('/notificaratraso/:idUser', function(req, res, next) {
	
	
	 var Data = new Date();
var Fuso = Data.getTimezoneOffset()/60-3;
if (Fuso) Data = new Date(Data.valueOf() + (Fuso * 3600000));
 var datafinal = Data;
		User.findById(req.params.idUser, function (err, users) {
		
				if (typeof users.qtdNotificado !== 'undefined') {
					var qtdNotx = users.qtdNotificado;
				      var qtdNot = users.qtdNotificado + 1;
				}else{
				var qtdNot = 1;
				}

				User.findOneAndUpdate({ '_id': req.params.idUser }, { $set: {

					qtdNotificado: qtdNot,
					dataUltimaNotificacao: datafinal

				} }, function (err, place) {
			if(err){
			res.send('erro');
			
			}else{
			var texto2 ="Olá prezado parceiro, por gentileza verificar taxas de repasse para o aplicativo que não foram repassadas para o guincho na mão.";

	emailgeral(place.email,"Aviso de taxa não paga",texto2);
				res.send('ok');
			
			}

				});

	
			});
	
			
		
	
});

router.get('/entrarpelofacebook', function(req, res, next) {
	
	res.redirect('https://www.facebook.com/dialog/oauth?client_id=491905641283942&redirect_uri=http://www.engrenagemweb.com.br/entrarfacebook&scope=email,user_website,user_location');
});


module.exports = router;
