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

var Expressando = function(opcoes, cd) {

  if (!opcoes) {
    throw new Error('É necessário informar a opção de configuração.');
  } 

  var configuracao = opcoes.configuracao;
  var aplicativo = opcoes.aplicativo;
  var credenciais = opcoes.credenciais;
  var lista = opcoes.lista;

  this.servidor = new Servidor(aplicativo, configuracao, credenciais, lista);
  cd(this);
};

Expressando.prototype.carregar = function() {
  this.servidor.carregarServicoCors();
  this.servidor.redirecionarAsConexoes();
  this.servidor.carregarAsRotas();
};

Expressando.prototype.escutar = function(cd) {
  this.servidor.escutarPorConexoes(cd);
};

module.exports = Expressando;