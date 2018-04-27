import * as $ from "jquery";
import { Grid } from "./grid";
import { Breakpoints } from "./breakpoints";

export class Clickhandler {

    constructor() {
        this.grid();
        this.breakpoint();
    }

    grid(): void {
        var grid = new Grid();

        $(document).on('click', '.nav .styleguide-grid', function(e){
            e.preventDefault();
            $(this).toggleClass('active');

            if ($(this).hasClass('grid-visible')) {
                $('.wrapper .styleguide-grid').remove();
                $(this).removeClass('grid-visible');
            } else {
                $('.wrapper').prepend(
                    grid.overlay()
                );

                $(this).addClass('grid-visible');
            }

        });
    }

    breakpoint(): void {
        var breakpoint: any = new Breakpoints();

        $(document).on('click', 'a[data-breakpoint]', function(e){
            e.preventDefault();

            $('.small').removeClass('small');
            $('.active').removeClass('active');
            $(this).toggleClass('active');

            if ($(this).data('breakpoint') == 'xs') {
                $('.wrapper')
                    .addClass('small')
                    .css('max-width', '320px');
            } else if ($(this).data('breakpoint') == 'xl'){
                $('.wrapper')
                    .removeClass('small')
                    .removeAttr('style');
            } else {
                $('.wrapper')
                    .addClass('small')
                    .css('max-width', breakpoint.breakpoints[$(this).data('breakpoint')]);
            }
        });

    }
}



