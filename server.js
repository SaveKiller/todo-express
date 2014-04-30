
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var repo = require('./routes/repo');
var http = require('http');
var path = require('path');


/* var db = mongoskin.db('localhost:27017/todo', {w:1} ); */


var app = express();

/*
app.use(function(req, res, next)
{
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
})
*/

app.locals.appname = 'Express.js Todo App'
// all environments


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
app.use(express.csrf());

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next)
{
  res.locals._csrf = req.session._csrf;
  return next();
})


app.use(app.router);

// development only
if ('development' == app.get('env'))
{
  app.use(express.errorHandler());
}





// app.param => E' un handler che intercetta i parametri passati
// alle rotte e permette di eseguire azioni
// (di controllo, di autenticazione, etc) ai parametri prima di
// passarli alla funzione della rotta

/*
app.param('task_id', function(req, res, next, taskId)
{
  req.db.tasks.findById(taskId, function(error, task)
  {
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});
*/


app.get('/', routes.index);
app.get('/tasks', repo.list);
app.post('/tasks', repo.markAllCompleted)
app.post('/tasks', repo.add);
app.post('/tasks/:task_id', repo.markCompleted);
app.del('/tasks/:task_id', repo.del);
app.get('/tasks/completed', repo.completed);

app.all('*', function(req, res)
{
  res.send(404);
})




http.createServer(app).listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
