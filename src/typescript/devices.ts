import * as $ from "jquery";

export class Devices {

    devices: any = [];

    constructor() {
        this.init();
    }

    init(): void {
        this.setDevices();
        this.addDevicesNode();
    }

    addDevicesNode(): void {
        if ($('.nav li.atoms').length > 0) {
            $('.nav li.atoms').after(
                $('<li />')
                    .addClass('nav-item dropdown devices')
                    .append(
                        $('<a />')
                            .addClass('nav-link dropdown-toggle')
                            .attr('data-toggle', 'dropdown')
                            .attr('href', '#')
                            .text('Devices')
                    )
                    .append(
                        $('<div />')
                            .addClass('dropdown-menu')
                    )
            );

            $.each(this.devices, function(key, value){
                var nav = $('<a />')
                    .addClass('nav-link device')
                    .attr('href', '#')
                    .text(key)
                    .attr('data-device-width', value.width)
                    .attr('data-device-height', value.height);

                $('li.devices .dropdown-menu').append(nav);
            });
        }
    }

    setDevices(): any {
        if ($('html').data('devices')) {
            this.devices = $('html').data('devices');
        }
    }
}