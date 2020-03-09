let helper = require("node-red-node-test-helper")
let configNode = require("../nodes/toggl-config.js")
let MockToggl = require('toggl-api')

helper.init()

describe("config node", ()=>{
    beforeEach((done)=>{
        jest.clearAllMocks()
        helper.startServer(done)
    })

    afterEach((done)=>{
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [ {id:"conf",type:"toggl-config", name: "Default"} ]
    
    it("can be created", (done)=>{
        helper.load(configNode, flow, {conf:{token:""}}, ()=>{
            let node = helper.getNode('conf')
            expect(node).toHaveProperty('name', "Default")
            
            done()
        })
    })


    it("takes an API token parameter", done=>{
        const TOKEN = "bob"
        helper.load(configNode, flow, {conf:{token:TOKEN}}, ()=>{
            let node = helper.getNode('conf')
            
            expect(node).toHaveProperty('credentials.token', TOKEN)
            expect(MockToggl).toHaveBeenCalledTimes(1)
            expect(MockToggl).toHaveBeenCalledWith({apiToken:TOKEN})

            done()
        })
    })

    it("should warn if there is no API token", done=>{
        helper.load(configNode, flow, ()=>{
            let node = helper.getNode('conf')
            
            expect(node).not.toHaveProperty('credentials.token')
            node.warn.should.have.been.called()

            done()
        })

    })

    // describe('node setup APIs', ()=>{
    
    // })
})
