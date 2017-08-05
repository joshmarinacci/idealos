module.exports = [


    {
        type:'alarm',
        time: 60*8+30,
        enabled:false,
        name:'wake up',
        repeat:['none']
    },
    {
        type:'alarm',
        time:60*10,
        enabled:true,
        name:'drink second cup of coffee',
        repeat:['weekday']
    },
    {
        type:'alarm',
        time:60*14+15,
        enabled:false,
        name:'afternoon coffee',
        repeat:['weekday']
    },






    {
        type:'email',
        from:'Nigerian Prince',
        subject:'A fortune you have inherited',
        folder:['inbox'],
        read:false,
        content: {
            mimeType:'text/plain',
            text:"Dear sirs"
        }
    },
    {
        type:'email',
        from:'Nigerian Princess',
        subject:'Yet another fortune!',
        folder:['inbox'],
        read:true,
        content: {
            mimeType:'text/plain',
            text:"Dear sirs"
        }
    },

    {
        type:'email',
        from:'United',
        subject:'Flight update',
        folder:['travel'],
        read:true,
        content: {
            mimeType:'text/plain',
            text:"Dear sirs"
        }
    },



    {
        type:'event',
        datetime:{
            day:31,
            month:8,
            year:2017
        },
        title:'birthday',
    },
    {
        type:'event',
        datetime:{
            day:15,
            month:8,
            year:2017,
            hour:10,
            minute:15
        },
        title:'birthday',
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
    },
    {
        type:'contact',
        first:'Bill',
        last:"Roberts",
    },

    {
        type:'contact',
        first:'Rob',
        last:"Williams",
    },

    {
        type:'contact',
        first:'Steve',
        last:"Martin",
    },


];