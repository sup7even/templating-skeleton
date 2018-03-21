import * as $ from "jquery";
import { App } from "./app";
import { Breakpoints } from './breakpoints';

$(function() {
    var breakpoint: any = new Breakpoints();
    var styleguide = new App();

    styleguide.createBreakpointSwitcher();

    console.log('active breakpoint is: '+ breakpoint.is);

    $(window).on('resize', function() {
        if (breakpoint.hasChanged()) {
            console.log('resized breakpoint is: '+ breakpoint.is);
        }
    });
});