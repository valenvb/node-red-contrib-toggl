let helper = require("node-red-node-test-helper")
let configNode = require("../nodes/toggl-config.js")
let startTimerNode = require("../nodes/start-timer.js")
let MockToggl = require('toggl-api')

helper.init()

describe("start timer",()=>{
    const Projects = [{id:1,name:"project1"}, {id:2, name:"Project 2"}]
    beforeEach((done)=>{
        jest.clearAllMocks()
        helper.startServer(done)
    })

    afterEach((done)=>{
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [ {id:"conf",type:"toggl-config"},{id:"start",type:"toggl-start-timer", toggl:"conf", workspace: "1", wires:[['out']]}, {id:'out', type:'helper'} ]

    it("should call startTimeEntry", (done)=>{
        let ExpectData = {
            created_with: "Node-Red",
            description : null,
            wid : 1,
            pid : null,
            tags: null,
        }

        helper.load([startTimerNode, configNode], flow, {conf:{token:"123"}},()=>{
            let startNode = helper.getNode('start')
            let outNode = helper.getNode('out')
            outNode.on('input', (msg)=>{
                msg.should.have.property('payload', "fakeEntry")
                expect(MockToggl.prototype.startTimeEntry).to.have.been.called//With(sinon.match(ExpectData))
                // sinon.assert.calledWith(MockToggl.prototype.startTimeEntry, ExpectData)
                done()
            })
            
            startNode.receive({})

        })
    })


})