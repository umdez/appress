# Iniciando o expressando

O expressando poderá ser iniciado facilmente ao informar o arquivo de configuração, seguido do aplicativo express, as credenciais e uma 
lista de rotas pré-carregadas.

```javascript

// Carregamos aqui o servidor express, o cors e o redirecionamento.
var expressando = new Expressando({
  "configuracao": configuracao
, "aplicativo": aplicativo
, "credenciais": credenciais
, "lista": listaDeRotas
}, function(objExpressando) { 
  // Quando estiver completo...
});

// Carregaremos os serviços CORS, o redirecionamento e o aplicativo express.
expressando.carregar();  
  
// Iniciamos a escuta por conexões normais e seguras com o nosso serviço express.
expressando.escutar(function() {
  // tudo pronto...
});  
```
