/*******************************************************************
 * Appress é de (C) propriedade da Devowly Sistemas 2015-2016      *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id rotas.js, criado em 06/08/2016 às 13:51 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var Rotas = function(lista, aplicativo) {

  /* @Propriedade {Matriz} [listaDeRotas] As rotas do nosso aplicativo. */
  this.listaDeRotas = lista;

  /* @Propriedade {Objeto} [aplic] O aplicativo express. */
  this.aplic = aplicativo;
};

Rotas.prototype.carregar = function() {

  var esteObjeto = this;

  _.forEach(this.listaDeRotas, function(diretorio) {
    esteObjeto.aplic.use(diretorio.rota, diretorio.caminho);  
  });
}

module.exports = Rotas;