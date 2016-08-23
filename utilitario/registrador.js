'use strict';

/*******************************************************************
 * Expressando é de (C) propriedade da Devowly Sistemas 2015-2016  *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id registrador.js, criado em 08/08/2016 às 11:50 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Realiza o registro de mensagems de atividade */

var bunyan = require('bunyan');

// Usa as variaveis de ambiente LOGSTASH_HOST e LOGSTASH_PORT
// para enviar os registros para logstash por meio de udp.
var configuracao = {
  name: 'app-expressando',
  streams: [{
    level: 'debug',
    stream: process.stdout
  }],
  level: 'debug'
};

if (process.env.LOGSTASH_HOST && process.env.LOGSTASH_PORT) {
  console.log('logstash habilitado');
  configuracao.streams.push({
    level: 'debug',
    type: 'raw',
    stream: require('bunyan-logstash-tcp').createStream({
      host: process.env.LOGSTASH_HOST,
      port: process.env.LOGSTASH_PORT
    })
  });
} else {
  console.log('logstash não habilitado');
}

var registro = bunyan.createLogger(configuracao);

function registrador(nome) {
  return registro.child({
    widget_type: nome // jshint ignore:line
  });
}

module.exports = registrador;