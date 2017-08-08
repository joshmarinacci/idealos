import Point from "./Point";

export default class DragAction {
    constructor(e,cb) {
        this.startXY = new Point(e.screenX, e.screenY);
        this.diff = new Point(0,0);

        this.mouse_move_listener = (e) => {
            const oldDiff = this.diff;
            this.diff = new Point(e.screenX, e.screenY).minus(this.startXY);
            this.delta = this.diff.minus(oldDiff);
            if(cb)cb(this);
        };
        this.mouse_up_listener = (e) => {
            document.removeEventListener('mousemove', this.mouse_move_listener);
            document.removeEventListener('mouseup', this.mouse_up_listener);
            this.mouse_move_listener = null;
            this.mouse_up_listener = null;
            this.diff = new Point(e.screenX, e.screenY).minus(this.startXY);
        };

        document.addEventListener('mousemove', this.mouse_move_listener);
        document.addEventListener('mouseup', this.mouse_up_listener);
    }
}
