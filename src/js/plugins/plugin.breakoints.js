(function($){
    $.Breakpoints = function(options) {

        plugin = this;
        defaults = {
            init: false,
            selector: $('body'),
        };
        if (!options) {
            options = {
                init: defaults.init,
                selector: defaults.selector
            }
        } else {
            options = $.extend({}, defaults, options);
        }

        plugin.init = function() {
            if (options.selector.css('content')) {
                var _breakpoints = options.selector.css('content').slice(1, -1);
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

                if ($('.breakpoint:visible').length > 0) {
                    this.activeBreakpoint = $('.breakpoint:visible').first().data('breakpoint').toUpperCase();
                } else {
                    this.activeBreakpoint = 'XS';
                }

                $('.breakpoint').remove();
            }

            $.data(document, 'Breakpoints', options);
        }

        plugin.init();

        return this.activeBreakpoint;
    }
})(jQuery);