import React, {Component} from "react";
import RemoteDB from "./RemoteDB"

const style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '700px',
};

const st2 = {
    border: '1px solid red',
    width: '98px',
    height: '30px',
};

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("calendar");
        this.db.connect();
        this.state = {
            events: [],
        };
        this.query = this.db.makeLiveQuery({type: 'event'});
        this.query.on("execute", (docs) => {
            this.setState({events: docs});
        });
        this.query.on('update', (docs) => {
            this.setState({events: docs});
        });
        this.query.execute();

        this.db.whenConnected(()=>{
            this.db.sendMessage({
                type:'command',
                target: 'system',
                command: "resize",
                appid: this.props.appid,
                width:700,
                height:350
            });
        })
    }

    render() {
        let days = [];
        for (let i = 0; i < 31; i++) {
            const matching = this.state.events.find((e) => e.datetime.day === (i + 1));
            let content = "" + (i + 1);
            if (matching) {
                console.log("found one");
                content = (i + 1) + ' ' + matching.title;
            }
            days.push(<div key={i} style={st2}>{content}</div>)
        }

        return <div style={style}>{days}</div>
    }
}