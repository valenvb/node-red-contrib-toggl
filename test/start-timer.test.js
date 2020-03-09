let chai = require('chai')
chai.use(require('chai-things'))
chai.use(require('sinon-chai'))
let expect = chai.expect
let sinon = require('sinon')


const rewire = require('rewire')

let helper = require("node-red-node-test-helper")
let configNode = rewire("../nodes/toggl-config.js")
let startTimerNode = rewire("../nodes/start-timer.js")



describe("start timer",()=>{
    let MockToggl;
    const Projects = [{id:1,name:"project1"}, {id:2, name:"Project 2"}]
    let started = sinon.stub()
    beforeEach((done)=>{
        MockToggl = sinon.stub()

        MockToggl.prototype.startTimeEntry = function(...args){console.log(args);started()}
        
                //sinon.stub().callsArgWith(1,null, "fakeEntry")
        MockToggl.prototype.getWorkspaceProjects = sinon.stub().callsArgWith(1, null, Projects)
        configNode.__set__('TogglClient', MockToggl)

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