sink.Structure = [
    {
        text: 'Ext.ux.GooglePlacesField',
        card: new Ext.Panel({
		items   : [
			{
                xtype : 'googleplaces',
                label: 'location',
                hideMap: true
            }
		]
	}),
        leaf: true
    },
    {
        text: 'Ext.ux.GoogleMapPanel',
        card: new Ext.Panel({
		layout  : "card",
		cardSwitchAnimation : "slide",
		items   : [
			{ html : "Card One"   },
			{ html : "Card Two"   },
			{ html : "Card Three" },
			{ html : "Card Four"  }
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
