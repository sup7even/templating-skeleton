import * as $ from "jquery";
import "bootstrap";
import { App } from "./app";
import { Breakpoints } from './breakpoints';
import { Clickhandler } from "./cickhandler";

$(function() {
    var breakpoint: any = new Breakpoints();
    var styleguide: any = new App();
    var click: any = new Clickhandler();

    styleguide.createBreakpointSwitcher();
    styleguide.createDevicesSwitcher();
    styleguide.createSectionSwitcher();

    console.log('active breakpoint is: '+ breakpoint.is);

    $(window).on('resize', function() {
        if (breakpoint.hasChanged()) {
            console.log('resized breakpoint is: '+ breakpoint.is);
        }
    });
});