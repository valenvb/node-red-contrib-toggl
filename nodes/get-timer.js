module.exports = function(RED){
    function TogglGetTimerNode(config){
        RED.nodes.createNode(this, config)
        const toggl = RED.nodes.getNode(config.toggl).toggl

        this.on('input', (msg, send, done)=>{
            toggl.getCurrentTimeEntry((err, timeEntry)=>{
                if(timeEntry){
                    msg.payload = timeEntry
                    send(msg)
                    if(done){
                        done()
                    }
                } else {
                    //no current time entry
                    this.warn('No running time entry')
                    this.status({shape:'ring', style:'green', text:"No current time entry"})
                    if(done){
                        done('no running time entry')
                    }
                }
                
            })

        })

    }

    RED.nodes.registerType("toggl-get-timer", TogglGetTimerNode)
}