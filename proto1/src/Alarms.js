/*
 # alarms app
    alarm {
        time: minutes (rendered as hours and minutes)
        enabled: boolean
        name: string
        repeat: array: string
        type: alarm
    }
    items = query all docs type == alarm, ordered by time
vbox
    hbox
        push_button: insert new alarm
    scroll listview: items
        template(item)
            check_button <= item.enabled
            label: item.title
            label: floor(item.time/60) + item mod 60
            label: repeatToString(item.repeat)
*/


import React, {Component} from "react"
import {CheckButton, ListView, PushButton, Scroll} from "./GUIUtils";
import {HBox, VBox, PopupMenu, PopupManager} from "appy-comps"

const ColorItemTemplate = (props) => {
    return <label style={{backgroundColor:props.item}} onClick={props.onSelect}>some color</label>;
}

class AlarmTemplate extends Component {
    constructor(props) {
        super(props);

        const colors = ['white','black',"red",'green','blue'];

        this.state = {
            color:colors[0]
        };

        this.changed = (item) => {
            console.log('changed to ',item);
            PopupManager.hide();
            this.setState({color:item})
        };
        this.colorize = (e) => {
            var contents = <PopupMenu
                list={colors}
                template={ColorItemTemplate}
                onChange={this.changed}
            />;
            PopupManager.show(contents, this.refs.button);
        };
    }

    render() {
        const item = this.props.item;
        return <HBox>
            <CheckButton/>
            <label>{item.title}</label>
            <label>{Math.floor(item.time / 60) + ':' + item.time % 60}</label>
            <label>{item.repeat.join("")}</label>
            <button ref='button' onClick={this.colorize} style={{backgroundColor:this.state.color}}>colorize</button>
        </HBox>
    }
}

export default class Alarms extends Component {
    constructor(props) {
        super(props);
        this.query = props.db.makeLiveQuery({type:'alarm'});
        this.createAlarm = () => {
            var alarm = {
                type:'alarm',
                time: 60*6,
                enabled: true,
                name: 'unnamed alarm',
                repeat: ['none']
            };
            this.props.db.insert(alarm);
        }
    }
    render() {
        return <VBox grow>
            <HBox>
                <PushButton onClick={this.createAlarm} className="fa fa-plus">+</PushButton>
            </HBox>
            <VBox scroll grow>
                <ListView model={this.query} template={AlarmTemplate}/>
            </VBox>
        </VBox>
    }
}

