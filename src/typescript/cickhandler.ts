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

        $(document).on('click', '.nav .'+ grid.className, function(e){
            e.preventDefault();
            grid.toggleGrid($(this));
        });
    }

    breakpoint(): void {
        var breakpoint: any = new Breakpoints();

        $(document).on('click', 'a[data-breakpoint]', function(e){
            e.preventDefault();

            $('.small').removeClass('small');
            $('.active').removeClass('active');
            $(this).toggleClass('active');

            console.log($(this).data('breakpoint').indexOf('xl'));

            if ($(this).data('breakpoint') == 'xs') {
                $('.wrapper')
                    .addClass('small')
                    .css('max-width', '320px');
            } else if ($(this).data('breakpoint').indexOf('xl') !== -1){
                $('.wrapper')
                    .removeClass('small')
                    .removeAttr('style');
            } else {
                $('.wrapper')
                    .addClass('small')
                    .css('max-width', breakpoint.breakpoints[$(this).data('breakpoint')]);
            }

            var grid = new Grid();

            if ($('.nav-link.'+ grid.className).hasClass('grid-visible')) {
                grid.removeGrid();
                grid.addGrid();
            }
        });

    }
}



