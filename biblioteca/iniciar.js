'use strict';

/*******************************************************************
 * Appress é de (C) propriedade da Devowly Sistemas 2015-2016      *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id iniciar.js, criado em 06/08/2016 às 12:57 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

//var CORS = require('./cors');
//var Rotas = require('./rotas');
//var Servidor = require('./servidor');
//var registrador = require('./registrador')('appress');
//var utilitario = require('util');

var Expressando = function(configuracao, aplicativo) {

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
};

//utilitario.inherits(Expressando, CORS);
//utilitario.inherits(Expressando, Rotas);
//utilitario.inherits(Expressando, Servidor);

Expressando.prototype.iniciar = function(ok) {
  console.log(ok);
};

module.exports = Expressando;