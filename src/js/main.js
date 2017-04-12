$(document).ready(function(){
    $('body').breakpoints({
        init: true,
    });

    console.log('You are in '+ window.breakpoint +' breakpoint');
});

$(window).resize(function(){
   $('body').breakpoints();
   console.log('You are in '+ window.breakpoint +' breakpoint');
});

(function($){
    $.fn.breakpoints = function(options) {

        if (!options) {
            options = {
                init: false
            }
        }

        if ($(this).css('content')) {
            var _breakpoints = $(this).css('content').slice(1, -1);
            var _breakpoints = _breakpoints.split(',');
            var _keys = [];
            var _vals = [];

            $.each(_breakpoints, function (k, v) {
                if (!parseInt(v) && v != 0) {
                    _keys.push(v);
                } else {
                    _vals.push(v);
                }
            });

            var _return = {};
            $.each(_keys, function (k, v) {
                _return[v] = _vals[k];

                if (options.init === true) {
                    $('body').prepend('<i class="breakpoint hidden-' + v + '-down" data-breakpoint="' + v + '" data-width="' + _vals[k] + '" />');
                }
            });

            var _activeBreakpoint = $('.breakpoint').not(':visible').slice(-1);
            window.breakpoint = _activeBreakpoint.data('breakpoint').toUpperCase();
        }

        return this;
    };
})(jQuery);