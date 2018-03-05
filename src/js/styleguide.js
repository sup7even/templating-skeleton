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

    $('.nav').append('<li class="nav-item dropdown sections"><a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Atoms</a><div class="dropdown-menu"></div></li>');

    $.each($(_body).find('h1'), function(k,v){
        var nav = $('<a />')
                    .addClass('nav-link')
                    .attr('href', '#')
                    .text($(v).text());

        $('.sections .dropdown-menu').append(nav);
    });

    $('.nav').append('<li class="nav-item dropdown devices"><a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Devices</a><div class="dropdown-menu"></div></li>');

    $.each(_devices, function(k, v){
        var nav = $('<a />')
            .addClass('nav-link device')
            .attr('href', '#')
            .text(k)
            .attr('data-device-width', v.width)
            .attr('data-device-height', v.height);

        $('.devices .dropdown-menu').append(nav);
    });

    $(document).on('click', '.device', function(e){
        e.preventDefault();
        var _width = $(this).data('device-width');
        var _height = $(this).data('device-height');

        if ($(this).hasClass('active')) {
            _width = $(this).data('device-height');
            _height = $(this).data('device-width');
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }

        $('.wrapper')
            .addClass('small')
            .css('max-width', _width)
            .find('iframe')
            .css('max-height', _height);
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

    $('.styleguide-settings').on('click', function(e){
        e.preventDefault();
        $('.modal.settings').modal();
    });

    

    var _grid = $('<div />')
        .addClass('styleguide-grid')
        .css('position', 'fixed')
        .css('display', 'flex')
        .css('flex-wrap', 'wrap')
        .css('pointer-events', 'none');

    var _cols = [];
    for(i = 1; i <= 12; i++) {
        _cols[i] = $('<div />').text('col-'+ i)
            .addClass('col-1')
            .css('background', 'rgba(0,0,0,0.3)')
            .css('position', 'relative')
            .prepend(
                $('<div />')
                    .css('width', 'calc(100% - 30px)')
                    .css('height', '100%')
                    .css('position', 'absolute')
                    .css('left', '15px')
                    .css('top', 0)
                    .css('background', 'rgba(0,0,0,.2)')
            );
    }

    $('.nav .styleguide-grid').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active');

        if ($(this).hasClass('grid-visible')) {
            $('.wrapper .styleguide-grid').remove();
            $(this).removeClass('grid-visible');
        } else {
            $('.wrapper').prepend(
                _grid
                    .css('top', $('.wrapper').offset().top)
                    .css('left', $('.wrapper').offset().left)
                    .width($('.wrapper').outerWidth())
                    .height($('.wrapper').outerHeight())
                    .prepend(_cols)
            );
            $(this).addClass('grid-visible');
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