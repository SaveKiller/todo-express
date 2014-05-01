


var tasks = require('mongoskin')
            .db('mongodb://localhost:27017/todo', {w:1})
            .collection('tasks');


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

    if (!req.body.newName) return next();

    tasks.save(
        {
            name: req.body.newName,
            completed: false
        },
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
    if (req.body.alldone !== 'true') return next();

    tasks.update(
        { completed: false },
        { $set: { completed: true }},
        {multi: true},
        function(error, count)
        {
            if (error) return next(error);
            console.info('Marked %s task(s) completed.', count);
            res.redirect('/tasks');
        })
};


exports.markCompleted = function(req, res, next)
{
    if (req.body.completed!=='true') return next();

    tasks.updateById(
        req.body.id,
        {
            $set: { completed: true }
        },
        function(error, count)
        {
            if (error) return next(error);
            if (count !==1) return next(new Error('Something went wrong.'));
            //console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
            res.redirect('/tasks');
        })
};


exports.listCompleted = function(req, res, next)
{
    tasks.find(
        {completed: true}).toArray(
            function(error, tasksCompleted)
            {
                res.render('tasks_completed',
                {
                    title: 'Completed',
                    tasks: tasksCompleted || []
                });
            });
};







exports.del = function(req, res, next)
{

    if (req.body.del!=='true') return next();

    tasks.removeById(
        req.body.id,
        function(error, count)
        {
            if (error) return next(error);
            if (count !==1) return next(new Error('Something went wrong.'));
            //console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
            res.send(200);
        });

};