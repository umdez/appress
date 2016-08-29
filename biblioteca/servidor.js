'use strict';

/*******************************************************************
 * Expressando é de (C) propriedade da Devowly Sistemas 2015-2016  *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id Servidor.js, criado em 06/08/2016 às 14:23 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var morgan = require('morgan');  
var registrador = require('../utilitario/registrador')('Expressando');
var _ = require('lodash');
var cors = require('cors');
var Promessa = require('bluebird');
//var sessao = require('express-session');

var Servidor = function(opcoes) {

  this.oAplicativo = opcoes.aplicativo;
  this.express = opcoes.express;
  this.aConfDoServidor = opcoes.configuracao.servidor;
  this.asCredenciais = opcoes.credenciais;
  this.aListaDeRotas = opcoes.lista;

  this.carregar();
};

Servidor.prototype.carregar = function() {
  var esteObjeto = this;

  this.oAplicativo.enable('trust proxy');
  this.oAplicativo.use(bodyParser.json({limit: this.aConfDoServidor.limite}));
  this.oAplicativo.use(bodyParser.urlencoded({limit: this.aConfDoServidor.limite, extended: false}));

  //this.oAplicativo.use(this.express.csrf());
  
  this.oAplicativo.use( this.express.cookieParser( "superSegredo" ) );
  //this.oAplicativo.use(sessao({ secret: "superSegredo", cookie: { httpOnly: true, secure: true }}));

  this.oAplicativo.set('porta', process.env.PORT || this.aConfDoServidor.porta);
  this.oAplicativo.set('portaSSL', process.env.SSLPORT || this.aConfDoServidor.portaSSL);
  
  this.oAplicativo.use(morgan(this.aConfDoServidor.registro || 'combined')); 
};

Servidor.prototype.redirecionarAsConexoes = function() {
  var esteObjeto = this;

  // Aqui nós iremos obrigado que as conexões não seguras sejam redirecionadas.
  // Para mais informações @veja http://stackoverflow.com/a/10715802
  this.oAplicativo.use(function(req, res, proximo) {
    // Se a requisição não for segura.
    if(!req.secure && esteObjeto.aConfDoServidor.exigirConSegura) {
      // Aqui faremos redirecionar para uma conexão segura.
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    proximo();
  });
};

Servidor.prototype.carregarAsRotas = function() {
 var esteObjeto = this;
 
  _.forEach(this.aListaDeRotas, function(diretorio) {
    esteObjeto.oAplicativo.use(diretorio.rota, diretorio.caminho);  
  });
};

Servidor.prototype.carregarServicoCors = function() {
  var esteObjeto = this;

  /* @Propriedade {Objeto} [aConfDoCors] Nossa configuração do CORS. */
  this.aConfDoCors = this.aConfDoServidor.cors;

  /* @Propriedade {Matriz} [aListaDasOrigensPermitidas] Aqui temos as origens
   * permitidas no nosso serviço CORS. Lembre-se que iremos oferecer dois tipos
   * de conexões (http e https).
   */
  this.aListaDasOrigensPermitidas = this.aConfDoCors.origem; 

  /* Iremos separar as preocupações do nosso projeto, para isso nós iremos
   * oferecer os serviços deste servidor para a parte da visão. Assim iremos
   * oferecer aceitação de conexões e requisições dos dominios de origem
   * permitidos utilizando o módulo CORS.
   * @Veja https://www.npmjs.com/package/cors
   */
  this.oAplicativo.use(cors({
    origin: function(origem, cd) {  // Origem aceita por este servidor express.
      var seOrigemPermitida = esteObjeto.aListaDasOrigensPermitidas.indexOf(origem) !== -1;
      cd(null, seOrigemPermitida);
    }  
  , methods:  this.aConfDoCors.metodos // Métodos aceitos.
  , allowedHeaders: this.aConfDoCors.cabecalhosAceitos
  , exposedHeaders: this.aConfDoCors.cabecalhosExpostos  
  , credentials: this.aConfDoCors.seUsarCredenciais
  }));
};

Servidor.prototype.escutarPorConexoes = function(pronto) {
  var esteObjeto = this;

  var iniciarEscutaHttp = function() {
    return new Promessa(function (deliberar, recusar) {
      // Inicia o servidor HTTP e começa a esperar por conexões.
      esteObjeto.oAplicativo.servidor = http.createServer(esteObjeto.oAplicativo);
      esteObjeto.oAplicativo.servidor.listen(esteObjeto.oAplicativo.get('porta'), function () {
        registrador.debug("Servidor HTTP express carregado e escutando na porta " + esteObjeto.oAplicativo.get('porta'));
        deliberar();
      });
    });
  };

  var iniciarEscutaHttps = function() {
    return new Promessa(function (deliberar, recusar) {
      // Inicia o servidor HTTPS e começa a esperar por conexões.
      esteObjeto.oAplicativo.servidorSSL = https.createServer(esteObjeto.asCredenciais, esteObjeto.oAplicativo);
      esteObjeto.oAplicativo.servidorSSL.listen(esteObjeto.oAplicativo.get('portaSSL'), function () {
        registrador.debug("Servidor HTTPS express carregado e escutando na porta " + esteObjeto.oAplicativo.get('portaSSL'));
        deliberar();
      });
    }) 
  };

  iniciarEscutaHttp()
  .then(iniciarEscutaHttps)
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });
};

module.exports = Servidor;