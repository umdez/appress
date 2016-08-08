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
var registrador = require('./registrador')('Expressando');

var Servidor = function(aplicativo, configuracao, credenciais, lista) {

  /* @Propriedade {Objeto} [oAplicativo] O aplicativo express. */
  this.oAplicativo = aplicativo;

  /* @Propriedade {Objeto} [aConfDoServidor] Nossa configuração do servidor
   * Express.
   */
  this.aConfDoServidor = configuracao.servidor;

  /* @Propriedade {Objeto} [asCredenciais] Contêm chave e certificado. */
  this.asCredenciais = credenciais;

  /* @Propriedade {Matriz} [aListaDeRotas] Contêm a lista das rotas utilizadas
   * pelo express. 
   */
  this.aListaDeRotas = lista;
};

Servidor.prototype.carregar = function() {
  var esteObjeto = this;

  /* Utilizamos o bodyParser para receber requisições POST ou PUT. Lembre-se de
   * manter o limit do body em 200kb para nos precaver dos ataques de negação de
   * serviço.
   */
  this.oAplicativo.use(bodyParser.json({limit: this.aConfDoServidor.limite}));
  this.oAplicativo.use(bodyParser.urlencoded({limit: this.aConfDoServidor.limite, extended: false}));

  // Porta ao qual iremos receber requisições http.  
  this.oAplicativo.set('porta', process.env.PORT || this.aConfDoServidor.porta);
  
  // Porta ao qual iremos receber requisições https.  
  this.oAplicativo.set('portaSSL', process.env.SSLPORT || this.aConfDoServidor.portaSSL);
  
  // Adicionamos isso para realizar o registro de requisições.
  this.oAplicativo.use(morgan(this.aConfDoServidor.registro || 'combined')); 

  this.redirecionarAsConexoes();
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
 
  _.forEach(this.aListaDeRotas, function(diretorio) {
    esteObjeto.aplic.use(diretorio.rota, diretorio.caminho);  
  });
};

Servidor.prototype.escutarPorConexoes = function() {
  var esteObjeto = this;

  // Inicia o servidor HTTP e começa a esperar por conexões.
  this.oAplicativo.servidor = http.createServer(this.oAplicativo);
  this.oAplicativo.servidor.listen(this.oAplicativo.get('porta'), function () {
    registrador.debug("Servidor HTTP express carregado e escutando na porta " + esteObjeto.aplic.get('porta'));
  });
  
  // Inicia o servidor HTTPS e começa a esperar por conexões.
  this.oAplicativo.servidorSSL = https.createServer(this.asCredenciais, this.oAplicativo);
  this.oAplicativo.servidorSSL.listen(this.oAplicativo.get('portaSSL'), function () {
    registrador.debug("Servidor HTTPS express carregado e escutando na porta " + esteObjeto.aplic.get('portaSSL'));
  });
};

module.exports = Servidor;