Ext.regModel('stuff', {    fields: ['id', 'calname', 'campus']
});

var store = new Ext.data.Store({
    model: 'stuff',
    proxy: {
        type: 'scripttag',
        url : 'http://events.cs50.net/api/1.0/calendars?id=128&output=jsonp&callback=parseResponse'
    },
    reader: {
        type: 'json'
    }
});

store.load();

sink.Structure = [
    {
        text: 'Ext.ux.GooglePlacesField',
        card: new Ext.Panel({
            items   : [
                {
                    xtype : 'googleplaces',
                    label: 'location',
                    useClearIcon: true,
                    hideMap: true
                }
            ]
        }),
        leaf: true
    },
    {
        text: 'Ext.ux.GoogleMapPanel',
        card: new Ext.Panel({
            items   : [
                {
                    xtype:'list',
                    height: 300,
                    itemTpl : '{calname}:  {campus}',

                    store: store
                }
            ]
        }),
        leaf: true
    }
];


Ext.regModel('Demo', {
    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'cardSwitchAnimation'},
        {name: 'card'}
    ]
});

sink.StructureStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: sink.Structure
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});
