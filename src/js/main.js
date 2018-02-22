$(document).ready(function(){
    window.activeBreakpoint = $.Breakpoints({init: true});
});

$(window).resize(function(){
    var _activeBreakpoint = $.Breakpoints();
    if (_activeBreakpoint !== window.activeBreakpoint) {
        window.activeBreakpoint = _activeBreakpoint;
        console.log(window.activeBreakpoint);
    }
});