/*******************************************************************
 * Appress é de (C) propriedade da Devowly Sistemas 2015-2016      *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id servidor.js, criado em 06/08/2016 às 14:23 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var morgan = require('morgan');  // Oferece registro para as requisições http do express

var Servidor = function(aplicativo, configuracao, credenciais) {

  /* @Propriedade {Objeto} [aplic] O aplicativo express. */
  this.aplic = aplicativo;

  /* @Propriedade {Objeto} [confDoServidor] Nossa configuração do servidor
   * Express. 
   */
  this.confDoServidor = configuracao;

  /* @Propriedade {Objeto} [minhasCredenciais] Contêm chave e certificado. */
  this.minhasCredenciais = credenciais;
};

Servidor.prototype.carregar = function() {
  var esteObjeto = this;

  /* Utilizamos o bodyParser para receber requisições POST ou PUT. Lembre-se de
   * manter o limit do body em 200kb para nos precaver dos ataques de negação de
   * serviço.
   */
  this.aplic.use(bodyParser.json({limit: this.confDoServidor.limite}));
  this.aplic.use(bodyParser.urlencoded({limit: this.confDoServidor.limite, extended: false}));

  // Porta ao qual iremos receber requisições http.  
  this.aplic.set('porta', process.env.PORT || this.confDoServidor.porta);
  
  // Porta ao qual iremos receber requisições https.  
  this.aplic.set('portaSSL', process.env.SSLPORT || this.confDoServidor.portaSSL);
  
  // Adicionamos isso para realizar o registro de requisições.
  this.aplic.use(morgan(this.confDoServidor.registro || 'combined')); 

  this.redirecionarAsConexoes();

  // Inicia o servidor HTTP e começa a esperar por conexões.
  this.aplic.servidor = http.createServer(this.aplic);
  this.aplic.servidor.listen(this.aplic.get('porta'), function () {
    //registrador.debug("Servidor HTTP express carregado e escutando na porta " + esteObjeto.aplic.get('porta'));
  });
  
  // Inicia o servidor HTTPS e começa a esperar por conexões.
  this.aplic.servidorSSL = https.createServer(this.minhasCredenciais, this.aplic);
  this.aplic.servidorSSL.listen(this.aplic.get('portaSSL'), function () {
    //registrador.debug("Servidor HTTPS express carregado e escutando na porta " + esteObjeto.aplic.get('portaSSL'));
  });
};

Servidor.prototype.redirecionarAsConexoes = function() {
  var esteObjeto = this;

  // Aqui nós iremos obrigado que as conexões não seguras sejam redirecionadas.
  // Para mais informações @veja http://stackoverflow.com/a/10715802
  this.aplic.use(function(req, res, proximo) {
    // Se a requisição não for segura.
    if(!req.secure && esteObjeto.confDoServidor.exigirConSegura) {
      // Aqui faremos redirecionar para uma conexão segura.
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    proximo();
  });
};

module.exports = Servidor;