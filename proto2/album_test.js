
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
        required: true,
        dummy: () => words.pick(4).join(" ")
    },
    track_count: {
        required: false,
        dummy: () => rand_int_range(10,20),
    },
    disc_count: {
        required: false,
        dummy: () => rand_int_range(1,2),
    },
    artist: {
        required: false,
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
    let obj = {}
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
    return obj
}

const check = {
    equals: (a,b) => {
        // console.log("is equal",a,b,a===b)
        if(a !== b) throw new Error(`not equals ${a} ${b}`)
    },
    not_null: (a) => {
        // console.log("not null",a,a!==null)
        if(a === null) throw new Error(`is null ${a}`)
    },
    dump:(a) => console.log(a),
}

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

// let ui1 = create_testing_ui(song1)
// check.equals(ui1.type,inputs.IntegerBox)
// check.equals(ui1.label,'Track No')

