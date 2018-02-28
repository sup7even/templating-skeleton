$(document).ready(function(){
    window.activeBreakpoint = $.Breakpoints({init: true});

    $.each(window.breakpoints, function(key, value) {
        var nav = $('<li />')
            .addClass('nav-item')
            .append(
                $('<a />')
                    .addClass('nav-link')
                    .attr('data-breakpoint', key)
                    .attr('href', '#')
                    .text(key)
            );

        $('.nav').append(nav);
    });

    var _iframe = document.getElementById('iframe');
    var _body = _iframe.contentDocument.getElementsByTagName('body')[0];

    $('.nav').append('<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Atoms</a><div class="dropdown-menu"></div></li>');

    $.each($(_body).find('h1'), function(k,v){
        var nav = $('<a />')
                    .addClass('nav-link')
                    .attr('href', '#')
                    .text($(v).text());

        $('.dropdown-menu').append(nav);
    });

    $(document).on('click', 'a[data-breakpoint]', function(e){
        e.preventDefault();
        $('.small').removeClass('small');
        $('.active').removeClass('active');
        $(this).toggleClass('active');

        if ($(this).data('breakpoint') == 'xs') {
            $('.wrapper')
                .addClass('small')
               .css('max-width', '320px');
        } else if ($(this).data('breakpoint') == 'xxl'){
            $('.wrapper')
                .removeClass('small')
                .removeAttr('style');
        } else {
            $('.wrapper')
            .addClass('small')
            .css('max-width', window.breakpoints[$(this).data('breakpoint')]);
        }
    });


});

$(window).resize(function(){
    var _activeBreakpoint = $.Breakpoints();
    if (_activeBreakpoint !== window.activeBreakpoint) {
        window.activeBreakpoint = _activeBreakpoint;
        console.log(window.activeBreakpoint);
    }
});