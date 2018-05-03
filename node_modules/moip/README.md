## MoIP SDK

Node.js sdk for MoIP, able to create payment and get payment info.

### Usage
  * Add dependency 'moip' in your package.json file.
  * Require 'moip' in your file.

    ```js
    var Moip = require('moip');

    var moip = new Moip({
	    token: '01010101010101010101010101010101',
	    key: 'ABABABABABABABABABABABABABABABABABABABAB',
	    sandbox: true // defaults to false
	});

	// When you are ready to go live, use your token and key

	var moip = new Moip({
	    token: 'your_token',
	    key: 'your_key'
	});
    ```

### API
  * CreatePayment (alias: EnviarInstrucaoUnica)

    ```js
    var payload = {
		EnviarInstrucao: {
		    InstrucaoUnica: {
		        Razao: 'Sandbox',
		        IdProprio: new Date().getTime(),
		        Valores: {
		            Valor: {
		                $: { 'moeda': 'BRL' },
		                _: 150
		            }
		        }
		    }
		}
	};

    moip.createPayment(payload, function (err, response) {
        if (err) {
            console.log('Error code', err.code);
            console.log('Error message', err.message);
        } else {
            // you will get the token
            console.log(response.token);
            // and the checkout url
            console.log(response.checkoutUrl);
            // but also the original XML response from MoIP
            console.log(response.xmlResponse);
        }
    });

    // This method has an alias: enviarInstrucaoUnica
    moip.enviarInstrucaoUnica(payload, function (err, response) {
    	// ...
    });
    ```

  * GetPaymentInfo (alias: ConsultarInstrucao)

    ```js
    var token = 'payment_token';

    moip.getPaymentInfo(token, function (err, response) {
        if (err) {
            console.log('Error code', err.code);
            console.log('Error message', err.message);
        } else {
            // response is the original 
            console.log(response);
        }
    });

    // This method has an alias: consultarInstrucao
    moip.consultarInstrucao(token, function (err, response) {
    	// ...
    });
    ```

### Tests
  Tests can be runned with:

  ```sh
  mocha
  ```

### Reference
  <a href="https://labs.moip.com.br/referencia/visao-geral-2/" target="_blank">CreatePayment/EnviarInstrucaoUnica</a>  
  <a href="https://labs.moip.com.br/referencia/consulta-de-instrucao/" target="_blank">GetPaymentInfo/ConsultarInstrucao</a>  
