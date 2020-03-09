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

    // const flow = [ {id:"conf",type:"toggl-config"},{id:"start",type:"toggl-start-timer", toggl:"conf", workspace: "1", wires:[['out']]}, {id:'out', type:'helper'} ]
    //const flow = [ {id:"conf",type:"toggl-config"},{id:"start",type:"toggl-start-timer", toggl:"conf", workspace: "1", wires:[[]]} ]

    const FLOW = [{
        id: "test",
        type: "toggl-start-timer",
        name: "",
        toggl: "conf",
        workspace: "1",
        description: "",
        tags: [],
        overwriteTags: false,
        wires: [['out']]
    },
    {id:'out', type:'helper'} ,
    {id: "conf", type: "toggl-config", name: "Default" }
    ]

    it("should load", (done)=>{
        
        helper.load([startTimerNode,configNode], FLOW, {conf:{token:"123"}},()=>{
            let startNode = helper.getNode('test')
            let outNode = helper.getNode('out')
                       
            expect(startNode).toBeTruthy()
            expect(startNode).toHaveProperty('toggl')

            outNode.on('input', (msg)=>{
                //msg.should.have.property('payload', "fakeEntry")
                //console.log(msg)
                expect(msg).toHaveProperty('payload')
                expect(MockToggl.startTimeEntry).toHaveBeenCalled()
                let data = MockToggl.startTimeEntry.mock.calls[0][0] //data param

                expect(data).toEqual({
                    created_with: 'Node-Red',
                    description: '',
                    wid: '1',
                    pid: null,
                    tags: ''
                })
                
                done()
            })
            
            startNode.receive({})

        })
    })


})