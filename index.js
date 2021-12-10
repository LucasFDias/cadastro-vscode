const { Knex } = require('knex');
const restify = require('restify');

const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

// Conexão mysql knex
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'node_db'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


server.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'
}));

server.get('/read', function (req, res, next) {

  knex('rest').then((dados)=>{

    res.send(dados);

  }, next);
  
});

server.post('/create', function (req, res, next) {
  
  knex('rest')
  .insert(req.body)
    .then((dados)=>{

    res.send(dados);

  }, next);
  
});

server.get('/show/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest').where('id', id).first().then((dados)=>{

    if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'));
    res.send(dados);

  }, next);
  
});


server.put('/update/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest').where('id', id).update(req.body).then((dados)=>{

    if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'));
    res.send('Dados Atualizados!');

  }, next);
  
});

server.del('/delete/:id', function (req, res, next) {

  const { id } = req.params;

  knex('rest').where('id', id).delete(req.body).then((dados)=>{

    if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'));
    res.send('Dados excluídos!');

  }, next);
  
});