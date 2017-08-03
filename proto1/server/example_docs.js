module.exports = [
    {
        type:'alarm',
        time: 60*8+30,
        enabled:false,
        name:'wake up',
        repeat:['none']
    },
    {
        type:'email',
        from:'Nigerian Prince',
        subject:'A fortune you have inherited',
        content: {
            mimeType:'text/plain',
            text:"Dear sirs"
        }
    },
    {
        type:'artist',
        name:'Erasure'
    },
    {
        type:'artist',
        name:'Depeche Mode'
    },
    {
        type:'artist',
        name:'Cars'
    },
    {
        type:'album',
        artist:'Erasure',
        name:'Wild'
    },
    {
        type:'album',
        artist:'Erasure',
        name:'The Innocents'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Some Great Reward'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Violator'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Songs of Faith and Devotion'
    },


    {
        type:'contact',
        first:"Josh",
        last:"Marinacci",
        address: [
            {
                street:"50 Nice Street",
                city:"Awesomeville",
                state:"TA",
                zip:"66666"
            }
        ]
    }

];