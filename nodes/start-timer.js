
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
        let statusTimeout;
        
        this.on('input', (msg, send)=>{
            if(statusTimeout){
                clearTimeout(statusTimeout)
            }
            this.status({})
            if(msg.payload){
                data.description = msg.payload
            }

            let resolveProject = new Promise( (resolve, reject)=>{
                if(msg.project){
                    if(typeof msg.project === "number"){
                        data.pid = msg.project
                        resolve()
                    } else if(typeof msg.project === "string"){
                        //lookup the project
                        this.toggl.getWorkspaceProjects(data.wid, (err, projects)=>{
                            if(err) {
                                reject(err);
                                return;
                            }

                            projects = projects.filter((proj)=>proj.name===msg.project)
                            if(projects.length>0){
                                data.pid = projects[0].id
                                this.status({shape:'ring', fill: 'green', text:"found project"})
                                resolve()
                            } else {
                                reject("No project found")
                            }
                        })
    
                    }
                } else {
                    resolve()
                }
            })

            resolveProject.then(()=>{
                this.toggl.startTimeEntry(data, (err, timeEntry)=>{
                    if(!err){
                        msg.payload = timeEntry
                        this.status({shape:'dot', fill: 'green', text:"started"})
                        send(msg)
                        
                        statusTimeout = setTimeout(() => {
                            this.status({})
                            clearTimeout(statusTimeout)
                        }, 2000);
                    }
                    if(err){
                        this.status({shape:'dot', fill: 'red', text:err})
                        msg.error = true;
                        msg.payload = err;
                        send(msg)
                    }
                })
            })
            .catch(reason=>{
                this.error(reason)
                this.status({shape:'dot', fill: 'red', text:reason})
            })
            
            
        });
    }
    RED.nodes.registerType("toggl-start-timer",TogglTimerStartNode);
}