let TogglClient = require('toggl-api');

module.exports = function(RED) {
    function TogglTimerStartNode(config) {
        RED.nodes.createNode(this,config);
        let node = this;
        let toggl = new TogglClient({apiToken:this.credentials.token})
        node.on('input', function(msg, send) {
            toggl.startTimeEntry({description: msg.payload}, (err, timeEntry)=>{
                if(!err){
                    msg.timeEntry = timeEntry
                    send(msg)
                }
            })
        });
    }
    RED.nodes.registerType("toggl-start-timer",TogglTimerStartNode, {credentials: {token:{type:"text"}}});
}