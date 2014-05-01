$(document).ready(function()
{
    var alert = $('.alert');

    alert.hide();

    alert.on('error', function(event, data)
    {
        alert.html(data)
        alert.addClass('alert-danger');
        alert.show();
    });

    alert.on('success', function(event, data)
    {
        alert.html(data);
        alert.addClass('alert-info');
        alert.show();
    })



    $('.task-delete').click(function(event)
    {
        var target = $(event.target)
        $.ajax(
        {
            type: 'DELETE',
            url: '/tasks/',
            data:
            {
                _csrf: target.attr('data-csrf'),
                id: target.attr('data-task-id'),
                del: 'true'
            },
            success: function(response)
            {
                target.parent().parent().remove();
                alert.trigger('success', 'Task was removed.');
            },
            error: function(error)
            {
                alert.trigger('error', error);
            }
        })
    });




})