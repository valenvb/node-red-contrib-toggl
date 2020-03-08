
module.exports = function(RED) {
    function TogglTimerStopNode(config) {
        RED.nodes.createNode(this,config);
        this.toggl = RED.nodes.getNode(config.toggl).toggl
            
        let statusTimeout;
        
        this.on('input', (msg, send, done)=>{
            if(statusTimeout){
                clearTimeout(statusTimeout)
            }
            this.status({})

            //get current time entry:
            let currentTimeEntry = new Promise((resolve, reject)=>{
                this.toggl.getCurrentTimeEntry((err, timeEntry)=>{
                    if(err){
                        reject(err)
                    } else if(timeEntry) {
                        resolve(timeEntry.id)
                    } else {
                        reject('no running time entry')
                    }
                })
            })

            currentTimeEntry.then(id=>{
                this.toggl.stopTimeEntry(id, (err, timeEntry)=>{
                    if(err){
                        return Promise.reject(err)
                    } else {
                        
                        msg.payload = timeEntry
                        send(msg)
 
                        this.status({shape:'dot', fill: 'green', text:"timer stopped"})
                        statusTimeout = setTimeout(() => {
                            this.status({})
                            clearTimeout(statusTimeout)
                        }, 2000);           
                    }
                })
            }).catch(reason=>{
                this.error(reason)
                this.status({shape:'dot', fill: 'red', text:reason})
            }).finally(()=>{
                if(done) done()
            })
            
        });
    }
    RED.nodes.registerType("toggl-stop-timer",TogglTimerStopNode);
}