
module.exports = function(RED) {
    function TogglTimerStartNode(config) {
        RED.nodes.createNode(this,config);
        this.toggl = RED.nodes.getNode(config.toggl).toggl
            
        let data = {
            created_with: "Node-Red",
            description : config.description,
            wid : config.workspace,
            pid: config.project,
            tags: config.tags,
        }

        this.on('input', (msg, send)=>{
            

            this.toggl.startTimeEntry(data, (err, timeEntry)=>{
                if(!err){
                    msg.payload = timeEntry
                    send(msg)
                }
                if(err){
                    msg.error = true;
                    msg.payload = err;
                    send(msg)
                }
            })
        });
    }
    RED.nodes.registerType("toggl-start-timer",TogglTimerStartNode);
}