// ensure the namespace exists
Ext.namespace('Ext.ux.form');
Ext.ux.form.GooglePlacesField = Ext.extend(Ext.form.Field, {
    hideMap: true,
    bodyBorder: false,
    border: false,
    initComponent: function() {
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
        if (!this.hideMap) {
            html += '<div style="height: ' + this.height + 'px;width: ' + this.width + 'px;margin-top: 0.6em;" id="' + this.id + '_map_canvas"></div>';
        }
        this.on('render', function() {
            var input = this.el.dom.querySelector('input');
            var options = {
//            types: ['establishment']
            };
            var me = this;
            var autocomplete = new google.maps.places.Autocomplete(input, options);
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
Ext.reg('googleplaces', Ext.ux.form.GooglePlacesField);
