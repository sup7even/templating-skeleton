import * as $ from "jquery";
import { Devices } from "./devices";
import { Sections } from "./sections";
import { Grid } from "./grid";

export class App {
    constructor() {
    }

    /**
     * creates the breakpoint navigation
     * @TODO: add selector
     */
    createBreakpointSwitcher(): void {
        $.each($('html').data('breakpoints'), function(key, value) {
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
    }

    /**
     * creates the devices navigation
     */
    createDevicesSwitcher(): void {
        new Devices();
    }

    createSectionSwitcher(): void {
        new Sections();
    }

    createGrid(): void {
        new Grid();
    }
}