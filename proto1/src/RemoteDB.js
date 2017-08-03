export default class {
    connect() {
        function log(...rest) {
            console.log(...rest);
        };
        console.log("connecting");
        const ws = new WebSocket('ws://localhost:5150');
        ws.onerror = () => log('WebSocket error');
        ws.onopen = () => {
            log('WebSocket connection established');
            // ws.send({command:'info'});
            // ws.send(JSON.stringify({command: 'db', type: 'alarm'}));
        }
        ws.onclose = () => log('WebSocket connection closed');
        ws.onmessage = function (event) {
            log("got websocket message", JSON.parse(event.data));
            //     updateStats(JSON.parse(event.data));
        };
    }
}
