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
}