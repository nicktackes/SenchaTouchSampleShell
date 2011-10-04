// ensure the namespace exists
Ext.namespace('Ext.ux.form');
Ext.ux.form.GooglePlacesField = Ext.extend(Ext.form.Text, {
    hideMap: true,
    bodyBorder: false,
    border: false,
    placeOptions: {
//            types: ['establishment']
    },
    initComponent: function() {
        this.placeOptions = this.placeOptions || {};
        this.renderTpl = [
            '<tpl if="label">',
            '<div class="x-form-label"><span>{label}</span></div>',
            '</tpl>',
            '<tpl if="fieldEl">',
            '<div class="x-form-field-container"><input id="{inputId}" type="{inputType}" name="{name}" onkeypress="javascript: var cmp=Ext.getCmp(\'' + this.id + '\'); cmp.onSearchChange();" class="{fieldCls}"',
            '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
            '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
            '<tpl if="style">style="{style}" </tpl>',
            '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
            '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
            '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
            '<tpl if="autoCorrect">autocorrect="{autoCorrect}" </tpl> />',
            '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
            '</div>',
            '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div></div></tpl>',
            '</tpl>'
        ];
        this.onGooglePlaceFound = this.onGooglePlaceFound || function(place) {
            console.log(Ext.encode(place));
        };
        this.on('render', function() {
            var input = this.el.dom.querySelector('input');
            var me = this;
            var autocomplete = new google.maps.places.Autocomplete(input, this.placeOptions);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                me.lastPlace = place;
                me.onPlaceConfirm();
            });
        }, this);

        Ext.ux.form.GooglePlacesField.superclass.initComponent.call(this);
    },
    onSearchChange: function() {
        // hack.  google doesn't give the ability to set z-index of the search results container.  so, force it up on first opportunity.
        if (!this.autocompleteZindexFixed) {
            this.autocompleteZindexFixed = true;
            var els = Ext.getBody().select('div[class="pac-container"]');
            if (els.elements.length > 0) {
                els.elements[0].style.setProperty('z-index', 10000);
            }
        }
    },
    onPlaceConfirm: function() {
        this.onGooglePlaceFound(this.lastPlace);
    }
});
// register xtype
Ext.reg('googleplacesfld', Ext.ux.form.GooglePlacesField);

Ext.ux.form.GooglePlacesPanel = Ext.extend(Ext.Panel, {
    items:[],
    panelHeight: 400,
    panelWidth:'100%',
    onGooglePlaceFound: function(place) {
        var map = this.getMap();
        map.map.setCenter(place.geometry.location);
        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: map.map,
            position: place.geometry.location
        });
        var addressPanel = this.getAddressPanel();
        addressPanel.update(place)
        console.log(Ext.encode(place));
        // if a url exists, retrieve this data and search for images
        if(place.url){
            
        }

    },
    getMap: function() {
        return this.items.items[1].items.items[0].items.items[0];
    },
    getAddressPanel: function() {
        return this.items.items[1].items.items[1].items.items[0];
    },
    initComponent: function() {
        var fldConfig = Ext.apply({}, this.initialConfig);
        fldConfig.xtype = 'googleplacesfld';

        var pfDelegate = Ext.util.Functions.createDelegate(this.onGooglePlaceFound, this);

        fldConfig.onGooglePlaceFound = pfDelegate;
        this.items.push(fldConfig);

        this.items.push({
            xtype: 'tabpanel',
            height: this.panelHeight,
            width: this.panelWidth,
        dock: 'bottom',
        styleHtmlContent: true,
        tabBar: {
            dock: 'bottom',
            layout: {
                pack: 'center'
            }
        },
        defaults: {
            scroll: 'vertical'
        },
        items: [
            {
                title: 'Map',
                iconCls: 'home',
                items:[
                    {
                        id: this.id + '_map',
                        xtype: 'map',
                        height: this.panelHeight,
                        width: this.panelWidth,
                        mapOptions: {
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        },
                        listeners:{
                            'maprender': function(extMap, googleMap) {
                                var task = new Ext.util.DelayedTask(function() {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(function(position) {
                                                    console.log('marking current location...');
                                                    var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                                    googleMap.setCenter(currentLocation);
                                                    var marker = new google.maps.Marker({
                                                        animation: google.maps.Animation.DROP,
                                                        map: googleMap,
                                                        position: currentLocation
                                                    });
                                                }, function() {
                                                    console.log('could not obtain geolocation');
                                                });
                                    }
                                }, googleMap);
                                task.delay(3000);
                            }
                        },
                        useCurrentLocation: false
                    }

                ]
            },
            {
                title: 'Address',
                iconCls: 'Info',
                items:[{
                    flex: 1,
                    id: this.id + '_address',
                    tpl: '<table class="ts-gp-text">' +
                        '<tr>' +
                        '<td rowspan="3">' +
                        '<img class="ts-gp-image" src="{icon}" />' +
                        '</td>' +
                        '<td class="ts-gp-label">' +
                        '{name}' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><div class="ts-icon-address"><p class="ts-p-label">' +
                        '{formatted_address}' +
                        '</p></div></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><div class="ts-icon-phone"><p class="ts-p-label">' +
                        '{formatted_phone_number}' +
                        '</p></div></td>' +
                        '</tr>' +
                        '</table>'
                }
                ]
            }
        ]
    });
        Ext.ux.form.GooglePlacesPanel.superclass.initComponent.call(this);
    }
});

// register xtype
Ext.reg('googleplaces', Ext.ux.form.GooglePlacesPanel);
