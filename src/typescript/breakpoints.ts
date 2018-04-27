import * as $ from "jquery";

export class Breakpoints {
    /**
     * all breakpoints
     *
     * @type {any[]}
     */
    breakpoints: any = [];

    /**
     * is breakpoint
     */
    is: string;

    /**
     * construtor
     */
    constructor() {
        this.init();
    }

    /**
     * init function is called via
     * constructor
     */
    init(): void {
        this.setBreakpoints();
        this.removeSelectorFromDom();
        this.setHtmlDataAttribute();
    }

    /**
     * sets the available breakpoints
     * @TODO: add selector
     */
    setBreakpoints(): void {
        var breakpointsFromBody = $('body').css('content').slice(1, -1).split(',');
        var breakpoints: any = {};
        var keys: any = [];
        var values: any = [];

        $.each(breakpointsFromBody, function (k: any, v: any) {
            if (!parseInt(v) && v != 0) {
                keys.push(v);
            } else {
                values.push(v);
            }
        });

        $.each(keys, function (k: any, v: any) {
            breakpoints[v] = values[k];
            $('body').append('<i class="breakpoint d-none d-' + v + '-block" data-breakpoint="' + v + '" data-width="' + values[k] + '" />');
        });

        this.breakpoints = breakpoints;
        this.is = $('.breakpoint:visible').length > 0 ? $('.breakpoint:visible').last().data('breakpoint').toUpperCase() : 'XS';
    }

    /**
     * checks if the breakpoint changes
     * useful in resizing actions
     *
     * @return {boolean}
     */
    hasChanged(): boolean {
        var breakpoints = this.breakpoints;

        $.each(breakpoints, function(key: any, value: any){
            $('body').append('<i class="breakpoint d-none d-' + key + '-block" data-breakpoint="' + key + '" data-width="' + breakpoints[key] + '" />');
        });

        var active = $('.breakpoint:visible').length > 0 ? $('.breakpoint:visible').last().data('breakpoint').toUpperCase() : 'XS';

        this.removeSelectorFromDom();

        if (this.is !== active) {
            this.is = active;
            return true;
        } else {
            return false;
        }
    }

    /**
     * removes the unwanted unused markup
     * @TODO: add selector
     */
    removeSelectorFromDom(): void {
        $('.breakpoint').remove();
    }

    /**
     * adds the json string to a dom element
     * @TODO: add selector
     */
    setHtmlDataAttribute():void {
        $('html').attr('data-breakpoints', JSON.stringify(this.breakpoints));
    }
}