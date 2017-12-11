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

                $('body').prepend('<i class="breakpoint d-none d-' + v + '-block" data-breakpoint="' + v + '" data-width="' + _vals[k] + '" />');
            });

            if (options.init === true) {
                window.breakpoints = _return;
            }

            var _activeBreakpoint = $('.breakpoint:visible').first();

            if (_activeBreakpoint.length > 0) {
                window.breakpoint = _activeBreakpoint.data('breakpoint').toUpperCase();
            } else {
                window.breakpoint = 'smallest';
            }

            $('.breakpoint').remove();
        }

        return this;
    };
})(jQuery);