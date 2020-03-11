module.exports = function(RED){
    function TogglGetTimerNode(config){
        RED.nodes.createNode(this, config)
        const toggl = RED.nodes.getNode(config.toggl).toggl

        this.on('input', (msg, send, done)=>{
            toggl.getCurrentTimeEntry((err, timeEntry)=>{
                if(err){
                    this.error(err)
                    this.status({shape:'dot',style:'red', text:err})
                    if(done) done(err)
                } else if(timeEntry){
                    msg.payload = timeEntry
                    send(msg)
                    if(done){
                        done()
                    }
                } else {
                    //no current time entry
                    this.warn('no currently running time entry')
                    this.status({shape:'ring', style:'green', text:"no time entry"})
                    if(done){
                        done('no currently running time entry')
                    }
                }
                
            })

        })

    }

    RED.nodes.registerType("toggl-get-timer", TogglGetTimerNode)
}