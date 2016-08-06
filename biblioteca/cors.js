/*******************************************************************
 * appress é de (C) propriedade da Devowly Sistemas 2015-2016      *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id cors.js, criado em 06/08/2016 às 13:06 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var cors = require('cors');

var CORS = function(configuracao, aplicativo) {

  /* @Propriedade {Objeto} [confDoCors] Nossa configuração do CORS. */
  this.confDoCors = configuracao.cors;

  /* @Propriedade {Matriz} [listaDasOrigensPermitidas] Aqui temos as origens
   * permitidas no nosso serviço CORS. Lembre-se que iremos oferecer dois tipos
   * de conexões (http e https).
   */
  this.listaDasOrigensPermitidas = this.confDoCors.origem;

  /* @Propriedade {Objeto} [aplic] O aplicativo express. */
  this.aplic = aplicativo;
};

CORS.prototype.carregar = function() {

  var esteObjeto = this;

  /* Iremos separar as preocupações do nosso projeto, para isso nós iremos
   * oferecer os serviços deste servidor para a parte da visão. Assim iremos
   * oferecer aceitação de conexões e requisições dos dominios de origem
   * permitidos utilizando o módulo CORS.
   * @Veja https://www.npmjs.com/package/cors
   */
  this.aplic.use(cors({
    origin: function(origem, cd) {  // Origem aceita por este servidor express.
      var seOrigemPermitida = esteObjeto.listaDasOrigensPermitidas.indexOf(origem) !== -1;
      cd(null, seOrigemPermitida);
    }  
  , methods:  this.confDoCors.metodos // Métodos aceitos.
  , allowedHeaders: this.confDoCors.cabecalhosAceitos
  , exposedHeaders: this.confDoCors.cabecalhosExpostos  
  , credentials: this.confDoCors.seUsarCredenciais
  }));
};

module.exports = CORS;