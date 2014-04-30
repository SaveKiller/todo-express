

var mongoskin = require('mongoskin');
var tasks = mongoskin.db('localhost:27017/todo', {w:1}).collection('tasks');


exports.list = function(req, res, next)
{
    tasks.find({completed: false}).toArray(function(error, tasks)
      {
        if (error) return next(error);
        res.render('tasks',
        {
          title: 'Todo List',
          tasks: tasks || []
        });
      });
};



exports.add = function(req, res, next)
{
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  tasks.save(
    { name: req.body.name, completed: false },
    function(error, task)
    {
        if (error) return next(error);
        if (!task) return next(new Error('Failed to save.'));
        console.info('Added %s with id=%s', task.name, task._id);
        res.redirect('/tasks');
    })
};



exports.markAllCompleted = function(req, res, next)
{
    if (!req.body.all_done || req.body.all_done !== 'true') return next();

    tasks.update(
        { completed: false },
        { completed: true},
        {multi: true},
        function(error, count)
        {
            if (error) return next(error);
            console.info('Marked %s task(s) completed.', count);
            res.redirect('/tasks');
        })
};



exports.completed = function(req, res, next)
{
    tasks.find(
        {completed: true}).toArray(
            function(error, tasks)
            {
                res.render('tasks_completed',
                {
                    title: 'Completed',
                    tasks: tasks || []
                });
            });
};



exports.markCompleted = function(req, res, next)
{
    if (!req.body.completed) return next(new Error('Param is missing'));



    tasks.updateById(
        req.param('task_id'),
        {
            completed: true
        },
        function(error, count)
        {
            if (error) return next(error);
            if (count !==1) return next(new Error('Something went wrong.'));
            //console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
            res.redirect('/tasks');
        })
};



exports.del = function(req, res, next)
{

    tasks.removeById(
        req.param('task_id'),
        function(error, count)
        {
            if (error) return next(error);
            if (count !==1) return next(new Error('Something went wrong.'));
            //console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
            res.send(200);
        });

};