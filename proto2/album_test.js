
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
            console.log("setting",key)
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
    Object.keys(type).forEach(key => {
        if(key === 'meta') return
        let def = type[key]
        if(!def.type) throw new Error(`type "${type.meta.name}" attribute "${key}" missing type`)
        // console.log(`def for ${key} is`,def)
        if(def.dummy) {
            obj[key] = def.dummy()
            console.log(`generate dummy ${type.meta.name}.${key} := "${obj[key]}"`)
        } else {
            if(def.type.dummy) {
                // console.log("def type has a dummy")
                obj[key] = def.type.dummy()
                console.log(`generate dummy ${type.meta.name}.${key} := "${obj[key]}"`)
            }
        }
        if(key in opts) {
            console.log("overriding ",key)
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
    check.dump(song1)
    check.equals(song1.get('track_number'),3)
    let song2 = create_dummy(Track)
    check.not_null(song2)
    check.dump(song2)
    check.not_null(song2.get('year'))

    let beatles = create(Artist, {title:'The Beatles'})
    check.dump(beatles)

    let song3 = create_dummy(Track, { artist: beatles})
    check.dump(song3)
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
}

class LiveQuery {
    constructor(opts) {
        this.opts = opts
    }
    current() {
        let res = DB.OBJS.filter(obj => {
            if(this.opts.type) {
                if(obj.type.name !== this.opts.type.name) return false
            }
            let atts = Object.keys(this.opts.attrs);
            for(let i=0; i<atts.length; i++) {
                let key = atts[i]
                let attr_filter = this.opts.attrs[key]
                // console.log("must filter",key,":",obj[key],":",attr_filter.value)
                //if it has a filter, then it must pass the filter
                if(attr_filter.type === 'eq' ) {
                    // console.log(`comparing ${obj[key]} ${attr_filter.type} ${attr_filter.value}`)
                    if (obj[key] !== attr_filter.value) return false
                }
            }
            return true
        })
        return new LiveQueryResults(res)
    }
    sync() {
        console.log("SYNC")
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
}

function create_live_query(type) {
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

    let yellowsub_query = create_live_query(Album).attr_eq("title","Yellow Submarine").make()
    yellowsub_query.sync()
    all_albums_query.sync()
    check.equals(all_albums_query.current().length(),4, 'total album count')
    check.equals(yellowsub_query.current().length(),0,'yellow sub should be 0')

    create_dummy(Album, {title: 'Yellow Submarine'})
    yellowsub_query.sync()
    all_albums_query.sync()
    check.equals(all_albums_query.current().length(),5, 'total album count')
    check.equals(yellowsub_query.current().length(),1)
}

function run_tests() {
    let args = Array.prototype.slice.call(arguments);
    try {
        args.forEach(f => {
            console.log(f)
            f()
        })
    } catch (e) {
        // console.log(e)
        console.log("ERROR ",e.message)
    }
}

run_tests(
    simple_test,
    query_test,
    )



// try to make a track with number 1000, which is out of range. should error out.
// make a track with a missing year. access it via optional. verify that it is null.


