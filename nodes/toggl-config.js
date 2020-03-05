let TogglClient = require('toggl-api');

module.exports = function(RED) {
    function TogglConfigNode(config) {
        RED.nodes.createNode(this,config);
        this.toggl = new TogglClient({apiToken:this.credentials.token})
        
    }
    RED.nodes.registerType("toggl-config",TogglConfigNode, {credentials: {token:{type:"text"}}});
}