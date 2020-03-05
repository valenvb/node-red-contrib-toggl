
module.exports = function(RED) {
    function TogglTimerStartNode(config) {
        RED.nodes.createNode(this,config);
        this.toggl = RED.nodes.getNode(config.toggl).toggl
                
        this.on('input', (msg, send)=>{
            this.toggl.startTimeEntry({description: msg.payload}, (err, timeEntry)=>{
                if(!err){
                    msg.timeEntry = timeEntry
                    send(msg)
                }
                if(err){
                    msg.err = err;
                    send(msg)
                }
            })
        });
    }
    RED.nodes.registerType("toggl-start-timer",TogglTimerStartNode);
}