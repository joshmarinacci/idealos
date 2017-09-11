import React, {Component} from "react";
import RemoteDB from "./RemoteDB";

export class ProfileImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src:'#'
        };
        this.setSourceFromDocs = (docs) => {
            if(!this.mounted) return;
            var avatar = docs[0].avatar;
            if(avatar.indexOf("resource:") === 0) {
                var id = avatar.slice("resource:".length);
                avatar = "http://localhost:5151/api/resource/"+id;
            }
            this.setState({src:avatar});
        };

        this.db = new RemoteDB("chat");
        this.db.query({id:props.item}).then(this.setSourceFromDocs);
    }
    componentWillReceiveProps(newProps) {
        if(this.props.item !== newProps.item) {
            this.db.query({id: newProps.item}).then(this.setSourceFromDocs);
        }
    }
    componentWillMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        return <img src={this.state.src} width={this.props.size} height={this.props.size}/>
    }
}