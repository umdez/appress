/*******************************************************************
 * appress é de (C) propriedade da Devowly Sistemas 2015-2016      *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id iniciar.js, criado em 06/08/2016 às 12:57 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var CORS = require('./cors');
var Rotas = require('./rotas');
var Servidor = require('./servidor');

exports.Appress = function() {};

Appress.prototype.iniciar = function(configuracao, aplicativo, registrador) {

  if (!configuracao) {
    throw new Error('É necessário informar a configuração do servidor.');
  } else if (!aplicativo) {
    throw new Error('É necessário informar um aplicativo.');
  }
  
  /* @Propriedade {Objeto} [aplic] O aplicativo express. */
  this.aplic = aplicativo;

  /* @Propriedade {Objeto} [confDoServidor] Nossa configuração do servidor
   * Express. 
   */
  this.confDoServidor = configuracao.servidor;

  //this.registrador = registrador;
};

Appress.prototype.carregarCors = function() {
  
  /* @Propriedade {Objeto} [cors] Nosso serviço CORS. */
  this.cors = new CORS(this.confDoServidor, this.aplic);

  // Carregamos o serviço CORS.
  this.cors.carregar();
};

Appress.prototype.carregarAsRotas = function(listaDeRotas) {
  
  /* @Propriedade {Objeto} [rotas] Nosso serviço de roteamento. */
  this.rotas = new Rotas(listaDeRotas, this.aplic);

  // Carregamos as nossas rotas.
  this.rotas.carregar();
};

Appress.prototype.carregarAsEscutas = function(credenciais) {

  /* @Propriedade {Objeto} [servidor] Nosso servidor express. */
  this.servidor = new Servidor(this.aplic, this.confDoServidor, credenciais);
};

