'use strict';

/*******************************************************************
 * Expressando é de (C) propriedade da Devowly Sistemas 2015-2016  *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id iniciar.js, criado em 06/08/2016 às 12:57 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var Servidor = require('./Servidor');
var utilitario = require('util');

var Expressando = function(configuracao, aplicativo, credenciais, lista) {

  if (!configuracao) {
    throw new Error('É necessário informar a configuração do servidor.');
  } else if (!aplicativo) {
    throw new Error('É necessário informar um aplicativo.');
  } else if (!credenciais) {
    throw new Error('É necessário informar as credenciais.');
  }

  this.servidor = new Servidor(aplicativo, configuracao, credenciais, lista);
};

Expressando.prototype.carregar = function() {
  this.servidor.carregar();
};

module.exports = Expressando;