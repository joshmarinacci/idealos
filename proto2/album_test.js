
const inputs = {

}

class SmartArray {
    constructor(data) {
        this.data = data
    }
    pick(count) {
        let res = []
        for(let i=0; i<count; i++) {
            res.push(this.random())
        }
        return res
    }

    random() {
        let index = Math.floor(Math.random()*this.data.length)
        return this.data[index]
    }
}

const words = new SmartArray(['foo','bar','baz','and','then','some','words','to','read'])
const names = new SmartArray(['The','Beatles','Mr','Mister','Strawberry','Ground'])
const rand_int_range = (min,max) => Math.floor(min+Math.random()*(max-min))

const Integer = {
    meta: {
        name: 'Integer',
        type: Number,
    }
}

const Year = {
    meta: {
        name: 'Year',
    },
    type: Integer,
    range: [-10000,10000],
    dummy: () => rand_int_range(1990,2020)
}

//Year := Integer, range(-10000,10000), dummy: new Integer(rand_int_range(1990,2020)),

const Artist = {
    meta: {
        name: 'Artist',
    },
    title: {
        type:String,
        required: true,
        dummy: () => names.pick(2).join(" "),
    }
}

const Album = {
    meta: {
        name: 'Album',
    },
    title: {
        type: String,
        required: true,
        dummy: () => words.pick(4).join(" ")
    },
    track_count: {
        type: Integer,
        required: false,
        dummy: () => rand_int_range(10,20),
    },
    disc_count: {
        type: Integer,
        required: false,
        dummy: () => rand_int_range(1,2),
    },
    artist: {
        type: Artist,
        required: false,
    }
}

const Track = {
    meta: {
        name: 'Track',
    },
    track_number: {
        required:false,
        type: Integer,
        dummy: () => rand_int_range(1,20),
        ui: { type: inputs.Number, columns: 2, label:'Track No' },
    },
    artist: {
        type: Artist,
        required: false,
        ui: { type: inputs.Dropdown_Search, label: 'Artist'},
    },
    album: {
        type: Album,
        required: false,
    },
    title: {
        type: String,
        required: false,
        dummy: () => words.pick(4).join(" "),
        ui: { type: inputs.Text, rows:1},
    },
    year: {
        type: Year,
        required:false,
        ui: { type: inputs.YearPicker, label:'Year'},
    }
}

const DB = {
    OBJS:[],
    clear_all() {
        this.OBJS = []
    }
}

function create(type, opts) {
    if(!type.meta) throw new Error("cannot make type without meta")
    opts = opts || {}
    // console.log("making an object of type", type)
    let obj = {}
    Object.keys(type).forEach(key => {
        if(key === 'meta') return
        let def = type[key]
        if(!def.type) throw new Error(`type "${type.meta.name}" attribute "${key}" missing type`)
        if(def.required && !(key in opts)) {
            throw new Error(`cannot make type ${type.meta.name}, missing required ${key}`)
        }
        if(key in opts) {
            // console.log("setting",key)
            obj[key] = opts[key]
        }
    })
    obj.get = function(name) {
        return this[name]
    }
    return obj
}

function create_dummy(type, opts) {
    opts = opts || {}
    let obj = {
        type: type,
    }
    // console.log(`Making instance of type ${type.meta.name}`)
    Object.keys(opts).forEach(key => {
        if(!type[key]) throw new Error(`can't set attr ${key} on type ${type.meta.name}`)
    })
    Object.keys(type).forEach(key => {
        if(key === 'meta') return
        let def = type[key]
        if(!def.type) throw new Error(`type "${type.meta.name}" attribute "${key}" missing type`)
        // console.log(`def for ${key} is`,def)
        if(def.dummy) {
            obj[key] = def.dummy()
            // console.log(`generate dummy ${type.meta.name}.${key} := "${obj[key]}"`)
        } else {
            if(def.type.dummy) {
                // console.log("def type has a dummy")
                obj[key] = def.type.dummy()
                // console.log(`generate dummy ${type.meta.name}.${key} := "${obj[key]}"`)
            }
        }
        if(key in opts) {
            obj[key] = opts[key]
        }
    })
    obj.get = function(name) {
        return this[name]
    }
    DB.OBJS.push(obj)
    return obj
}

const check = {
    equals: (a,b, msg) => {
        // console.log("is equal",a,b,a===b)
        if(a !== b) throw new Error(`${msg?msg:""}:  ${a} != ${b} `)
    },
    not_null: (a) => {
        // console.log("not null",a,a!==null)
        if(a === null) throw new Error(`is null ${a}`)
    },
    dump:(a) => console.log(a),
}

function simple_test() {
    let song1 = create(Track,{track_number:3})
    // check.dump(song1)
    check.equals(song1.get('track_number'),3)
    let song2 = create_dummy(Track)
    check.not_null(song2)
    // check.dump(song2)
    check.not_null(song2.get('year'))

    let beatles = create(Artist, {title:'The Beatles'})
    // check.dump(beatles)

    let song3 = create_dummy(Track, { artist: beatles})
    // check.dump(song3)
}


function ui_test() {
    // let ui1 = create_testing_ui(song1)
    // check.equals(ui1.type,inputs.IntegerBox)
    // check.equals(ui1.label,'Track No')
}


class LiveQueryResults {
    constructor(data) {
        this.data = data
    }
    length() {
        return this.data.length
    }
    toArray() {
        return this.data
    }
}

function isArray(value) {
    if(value instanceof Array) return true
    return false
}

class LiveQuery {
    constructor(opts) {
        this.opts = opts
    }
    current() {
        let res = DB.OBJS.filter(obj => {
            if(this.opts.type) {
                if(obj.type.meta.name !== this.opts.type.meta.name) return false
            }
            let atts = Object.keys(this.opts.attrs);
            for(let i=0; i<atts.length; i++) {
                let key = atts[i]
                let attr_filter = this.opts.attrs[key]
                // console.log("must filter",key,":",obj[key],":",attr_filter.value)
                if(this.fails_attr_eq(obj,key,attr_filter)) return false
                if(this.fails_attr_in_array(obj,key,attr_filter)) return false
            }
            return true
        })
        return new LiveQueryResults(res)
    }
    sync() {
        // console.log("SYNC")
    }

    fails_attr_eq(obj,key,attr_filter) {
        if(attr_filter.type !== 'eq') return false
        // console.log(`comparing ${obj[key]} ${attr_filter.type} ${attr_filter.value}`)
        if (obj[key] !== attr_filter.value) return true
        return false
    }

    fails_attr_in_array(obj, key, attr_filter) {
        if(attr_filter.type !== 'in-array') return false
        console.log(`checking if ${obj[key]} is in ${attr_filter.value}`)
        if(isArray(attr_filter.value)) {
            if(attr_filter.value.indexOf(obj[key])<0) return true
            return false
        }
        if( attr_filter.value instanceof LiveQuery) {
            if(attr_filter.value.current().toArray().indexOf(obj[key])<0) return true
            return false
        }
        throw new Error(`unknown attribute filter type ${attr_filter.type}`)
    }
}

class LiveQueryBuilder {
    constructor() {
        this.type = null
        this.attrs = {}
    }
    all(type) {
        this.type = type
        return this
    }
    make() {
        return new LiveQuery(this)
    }
    attr_eq(attr_name,value) {
        this.attrs[attr_name] = {
            type:'eq',
            value:value
        }
        return this
    }
    attr_in_array(attr_name, value) {
        this.attrs[attr_name] = {
            type:'in-array',
            value:value
        }
        return this
    }
}

function create_live_query() {
    return new LiveQueryBuilder()
}


/*
make a three albums
make a live query on all albums
add a fourth album
get the notification that it has been updated
 */

function query_test() {
    DB.clear_all()
    let album1 = create_dummy(Album)
    let album2 = create_dummy(Album)
    let album3 = create_dummy(Album)
    let all_albums_query = create_live_query().all(Album).make()
    check.equals(all_albums_query.current().length(),3,'all album check')
    all_albums_query.sync()
    let album4 = create_dummy(Album)
    all_albums_query.sync()
    check.equals(all_albums_query.current().length(),4)

    let yellowsub_query = create_live_query().all(Album).attr_eq("title","Yellow Submarine").make()
    yellowsub_query.sync()
    all_albums_query.sync()
    check.equals(all_albums_query.current().length(),4, 'total album count')
    check.equals(yellowsub_query.current().length(),0,'yellow sub should be 0')

    create_dummy(Album, {title: 'Yellow Submarine'})
    yellowsub_query.sync()
    all_albums_query.sync()
    check.equals(all_albums_query.current().length(),5, 'total album count')
    check.equals(yellowsub_query.current().length(),1)


    // make three tracks. one on album1 and two on album 2
    create_dummy(Track, {album:album1, title:'title1'})
    create_dummy(Track, {album:album2, title:'title2'})
    create_dummy(Track, {album:album2, title:'title3'})

    // make a track query. verify three tracks total
    let all_tracks_query = create_live_query().all(Track).make()
    all_tracks_query.sync()
    check.equals(all_tracks_query.current().length(),3)

    // make a track query for tracks on album1, verify 1 track
    let album1_tracks_query = create_live_query().all(Track).attr_eq('album',album1).make()
    check.equals(album1_tracks_query.current().length(),1)


    // make a track query for tracks on album2, verify 2 tracks
    let album2_tracks_query = create_live_query().all(Track).attr_eq('album',album2).make()
    check.equals(album2_tracks_query.current().length(),2)
    //check the titles
    check.equals(create_live_query().all(Track).attr_eq('title','title1').make().current().length(),1)
    check.equals(create_live_query().all(Track).attr_eq('title','title2').make().current().length(),1)
    //this one should fail
    check.equals(create_live_query().all(Track)
        .attr_eq('title','title4').make()
        .current().length(),0)

    //check if attr in array
    console.log("checking if title in [title1,title2]")
    check.equals(create_live_query().all(Track)
        .attr_in_array('title',['title1','title2','title4']).make()
        .current().length(),2)

    //check if track in one of a set of albums
    check.equals(create_live_query().all(Track)
        .attr_in_array('album',[album1,album2]).make()
        .current().length(),3)

    // all tracks for all albums.
    let all_albums = create_live_query().all(Album).make()
    let all_album_tracks = create_live_query().all(Track)
        .attr_in_array('album',all_albums).make()
    check.equals(all_album_tracks.current().length(),3)

    // make a Selection which contains an array of Albums
    // let selected_albums = create_dummy(Selection, {albums:[album2, album3]})

    // make a query of albums in the selection
    // let selected_albums_query = create_live_query().all(Track)
    //     .attr_in_array('album',selected_albums).make()
    // check.equals(selected_albums_query.current().length(),2)

    // make a query of tracks in albums in selection
    // let selected_tracks_query = create_live_query().all(Track)
    //     .attr_eq('album',selected_albums_query).make()
    // check.equals(selected_tracks_query.current().length(),2)
}

function run_tests() {
    let args = Array.prototype.slice.call(arguments);
    try {
        args.forEach(f => f())
    } catch (e) {
        console.log(e)
        console.log("ERROR ",e.message)
    }
}

run_tests(
    simple_test,
    query_test,
    )



// try to make a track with number 1000, which is out of range. should error out.
// make a track with a missing year. access it via optional. verify that it is null.


