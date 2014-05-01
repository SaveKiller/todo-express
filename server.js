
/**
 * Module dependencies.
 */



var express         = require('express');
var morgan          = require('morgan');
var repo            = require('./routes/repo');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var csurf           = require('csurf');
var less            = require('less-middleware');
var favicon         = require('static-favicon');

var app = express();


app.locals.appname = 'Express.js Todo App'
// all environments


app.set('port', "3001");
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(morgan(
    {
        format: 'dev',
        skip: function(req, res)
        {
            //return res.statusCode === 304;
            return false;
        }
    }));


app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
app.use(csurf());

app.use(less({ src: __dirname + '/public', compress: true }));
app.use(express.static(__dirname + '/public'));



app.use(function(req, res, next)
{
  res.locals._csrf = req.csrfToken();
  return next();
})





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








app.route('/')
    .get(function(req,res,next)
    {
        res.render('index', { title: 'Express.js Todo App' });
    });


app.route('/tasks')
    .get(repo.list)
    .post(repo.add)
    .post(repo.markAllCompleted)
    .post(repo.markCompleted)
    .delete(repo.del)




app.route('/tasks/completed')
    .get(repo.listCompleted)







app.all('*', function(req, res)
{
  res.send(404);
})



app.listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
