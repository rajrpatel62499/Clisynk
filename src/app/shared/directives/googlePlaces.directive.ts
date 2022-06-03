import {Directive, ElementRef, Output, EventEmitter, OnInit} from '@angular/core';

declare var google: any;

@Directive({
    selector: '[appGoogleplace]'
})
export class GoogleplaceDirective implements OnInit {

    @Output() addressSelect: EventEmitter<any> = new EventEmitter();
    private element: HTMLInputElement;

    constructor(elRef: ElementRef) {
        // elRef will get a reference to the element where
        // the directive is placed
        this.element = elRef.nativeElement;
    }

    getFormattedAddress(place) {
        const location_obj = {};
        for (const i of Object.keys(place.address_components)) {
            const item = place.address_components[i];
            location_obj['formatted_address'] = place.formatted_address;
            if (item['types'].indexOf('locality') > -1) {
                location_obj['city'] = item['long_name'];
            } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
                location_obj['state'] = item['long_name'];
            } else if (item['types'].indexOf('administrative_area_level_2') > -1) {
                location_obj['city'] = item['long_name'];
            } else if (item['types'].indexOf('street_number') > -1) {
                location_obj['street_number'] = item['long_name'];
            } else if (item['types'].indexOf('route') > -1) {
                location_obj['route'] = item['long_name'];
            } else if (item['types'].indexOf('country') > -1) {
                location_obj['country'] = item['long_name'];
            } else if (item['types'].indexOf('postal_code') > -1) {
                location_obj['postal_code'] = item['short_name'];
            }
        }
        location_obj['name'] = place.name;
        location_obj['lat'] = place.geometry.location.lat();
        location_obj['lng'] = place.geometry.location.lng();
        return location_obj;
    }

    ngOnInit() {
        const autocomplete = new google.maps.places.Autocomplete(this.element);
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            this.addressSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
        });
    }

}
