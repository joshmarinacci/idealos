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

];