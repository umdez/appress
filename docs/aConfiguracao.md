# Configuração

Nós teremos três blocos de configuração: Uma para a base do servidor, um para o serviço CORS e mais um para a configuração dos certificados
do nosso serviço express.

## O nosso servidor express.

| Diretiva | Propriedade | Tipo | Descrição  |
|---|---|---|---|
| servidor | registro | texto | A forma do registro a ser realizado pelo morgan. |
| servidor | porta | numero | A porta utilizada pelo servidor http express. |
| servidor | portaSSL | numero | A porta utilizada pelo servidor https express. |
| servidor | limite | texto | O limite do corpo body (Para nossa segurança). |
| servidor | exigirConSegura | boleano | se formos obrigar a utilização do protocolo https. |

Para exemplificar de forma mais simples os diversos valores possíveis nós provemos o código abaixo.
```javascript

/* @Diretiva {servidor} O nosso servidor http. */
config.servidor = {
  "registro": "combined"  
, "porta": 80             
, "portaSSL": 443         
, "limite": "200kb"        
, "exigirConSegura": true 
, "cors": null
, "certificados": null
};
```

## O nosso serviço CORS.

| Diretiva | Propriedade | Tipo | Descrição  |
|---|---|---|---|
| servidor.cors | origem | matriz | O endereço de origem que é permitido pelo cors. |
| servidor.cors | metodos | matriz | Os métodos de requisição aceitos. |
| servidor.cors | cabecalhosAceitos | matriz | Os cabeçalhos aceitos. |
| servidor.cors | cabecalhosExpostos | matriz | Aqui teremos os cabeçalhos **expostos** para as requisições ao servidor HTTP. |
| servidor.cors | seUsarCredenciais | boleano | Se formos utilizar as credenciais no serviço https. |

Para exemplificar de forma mais simples os diversos valores possíveis nós provemos o código abaixo.
```javascript

/* @Diretiva {servidor.cors} O nosso serviço Cors. */
config.servidor.cors = {                         
  "origem": ["http://localhost", "https://localhost"]
, "metodos": ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS']  
, "cabecalhosAceitos": ['Content-Range', 'X-total', 'Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
, "cabecalhosExpostos": ['Content-Range', 'X-total']
, "seUsarCredenciais": true
};
```

## Os nossos certificados de segurança.

| Diretiva | Propriedade | Tipo | Descrição  |
|---|---|---|---|
| servidor.certificados | chavePrivada | texto | Chave privada a ser utilizada. |
| servidor.certificados | certificado | texto | O certificado utilizado. |

Para exemplificar de forma mais simples os diversos valores possíveis nós provemos o código abaixo.
```javascript

/* @Diretiva {servidor.certificados} As nossas chaves privadas e certificados
 * para https. 
 */
config.servidor.certificados = {
  "chavePrivada": "servidorHttps.key" 
, "certificado": "servidorHttps.crt"   
};

```
