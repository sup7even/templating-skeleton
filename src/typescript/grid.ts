import * as $ from "jquery";
import {Breakpoints} from "./breakpoints";

export class Grid {
    grid: any;
    cols: any = [];

    constructor() {
        this.setGrid();
        this.setCols();
    }

    setGrid(): void {
        this.grid = $('<div />')
            .addClass('styleguide-grid')
            .css('position', 'fixed')
            .css('display', 'flex')
            .css('flex-wrap', 'wrap')
            .css('pointer-events', 'none');
    }

    setCols(): any {
        for(var i = 1; i <= 12; i++) {
            this.cols[i] = $('<div />').text('col-'+ i)
                .addClass('col-1')
                .css('background', 'rgba(0,0,0,0.3)')
                .css('position', 'relative')
                .css('text-align', 'center')
                .prepend(
                    $('<div />')
                        .css('width', 'calc(100% - 30px)')
                        .css('height', '100%')
                        .css('position', 'absolute')
                        .css('left', '15px')
                        .css('top', 0)
                        .css('background', 'rgba(0,0,0,.2)')
                );
        }
    }

    overlay(): any {
        console.log("overlay show");
        console.log(new Breakpoints().is);
        return this.grid
            .css('top', $('.wrapper').offset().top)
            .css('left', $('.wrapper').offset().left)
            .width($('.wrapper').outerWidth())
            .height($('.wrapper').outerHeight())
            .prepend(this.cols);
    }
}