import * as $ from "jquery";

export class Sections {
    iframe: any;

    body: any;

    constructor() {
        this.init();
    }

    init(): void {
        this.setIframe();
        this.setBody();

        var _sections: any = {};
        var i = 0;
        $.each(this.body.find('[data-section]'), function(key, value){
            i++;
            _sections[$(value).data('section')] = $(value)[0];
        });

        if (i > 0) {
            this.setNavItem(_sections);
            var body = this.body;

            $(document).on('click', '.dropdown-item', function(e){
                e.preventDefault();
                if ($(this).hasClass('show-all')) {
                    $(body).find('[data-section]').removeClass('d-none');
                } else {
                    $(body).find('[data-section]').addClass('d-none');
                    $(body).find('[data-section="'+ $(this).attr('href') +'"]').removeClass('d-none');
                }
            });
        }
    }

    setIframe(): any {
        this.iframe = document.getElementById('iframe');
    }

    setBody(): any {
        this.body = $(this.iframe.contentDocument.getElementsByTagName('body')[0]);
    }

    setNavItem(_sections: any): void {
        var _navItem = $('<li />')
            .addClass('nav-item dropdown sections')
            .append(
                $('<a />')
                    .addClass('nav-link dropdown-toggle')
                    .attr('data-toggle', 'dropdown')
                    .attr('href', '#')
                    .text('Sections')
            )
            .append(
                $('<div />')
                    .addClass('dropdown-menu')
            );

        _navItem.insertAfter('.grid');

        $.each(_sections, function(k, element){
            var nav = $('<a />')
                .addClass('dropdown-item')
                .attr('href', k.toLowerCase())
                .text(k);

            $('.sections .dropdown-menu').append(nav);
        });

        $('.sections .dropdown-menu')
            .append(
                $('<div />')
                    .addClass('dropdown-divider')
            )
            .append(
                $('<a />')
                    .addClass('dropdown-item show-all')
                    .attr('href', '#')
                    .text('Reset')
            );
    }
}
