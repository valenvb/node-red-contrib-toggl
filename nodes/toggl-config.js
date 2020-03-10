let TogglClient = require('toggl-api');

module.exports = function(RED) {
    function TogglConfigNode(config) {
        RED.nodes.createNode(this,config);

        if(! (this.credentials && this.credentials.token)){
            this.warn("No Toggl API token provided")
        }

        this.toggl = new TogglClient({apiToken:this.credentials.token})


        RED.httpNode.get(`/toggl/${this.id}/workspaces`, (_,res)=>{
            this.toggl.getWorkspaces((err, data)=>{
                if(err){
                    this.error(err)
                    res.status(500).send(err)
                }else{
                    res.send(data)
                }
            })
        })
        
        RED.httpNode.get(`/toggl/${this.id}/workspace/:ws/projects`, (req,res)=>{
            this.toggl.getWorkspaceProjects(req.params.ws, (err, data)=>{
                if(err){
                    this.error(err)
                    res.status(500).send(err)
                }else{
                    res.send(data)
                }
            })
        })
        
        RED.httpNode.get(`/toggl/${this.id}/workspace/:ws/tags`, (req,res)=>{
            this.toggl.getWorkspaceTags(req.params.ws, (err, data)=>{
                if(err){
                    this.error(err)
                    res.status(500).send(err)
                }else{
                    res.send(data)
                }
        })
        })
    }
    RED.nodes.registerType("toggl-config",TogglConfigNode, {credentials: {token:{type:"text"}}});
}