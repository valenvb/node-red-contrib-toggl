let chai = require('chai')
chai.use(require('chai-things'))
let sinon = require('sinon')

const rewire = require('rewire')

let helper = require("node-red-node-test-helper")
let configNode = rewire("../nodes/toggl-config.js")

let MockToggl;

describe("config node", ()=>{
    beforeEach((done)=>{
        MockToggl = sinon.stub()
        configNode.__set__('TogglClient', MockToggl)

        helper.startServer(done)
    })

    afterEach((done)=>{
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [ {id:"conf",type:"toggl-config", name: "Default"} ]
    
    it("can be created", (done)=>{
        helper.load(configNode, flow, {conf:{token:"bob"}}, ()=>{
            let node = helper.getNode('conf')
            node.should.have.property('name', "Default")
            sinon.assert.calledWithNew(MockToggl)
            done()
        })
    })


    it("takes an API token parameter", done=>{
        const TOKEN = "bob"
        helper.load(configNode, flow, {conf:{token:TOKEN}}, ()=>{
            let node = helper.getNode('conf')
            node.should.have.property('credentials', {token:TOKEN})
            sinon.assert.calledOnceWithExactly(MockToggl, {apiToken:TOKEN})
            done()
        })
    })

    // describe('node setup APIs', ()=>{
    
    // })
})
