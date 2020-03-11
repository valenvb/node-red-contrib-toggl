const waitForExpect = require('wait-for-expect')
let helper = require("node-red-node-test-helper")
let configNode = require("../nodes/toggl-config.js")
let getTimerNode = require('../nodes/get-timer')
let MockToggl = require('toggl-api')

helper.init()

describe("get timer node", ()=>{
    beforeEach((done)=>{
        jest.clearAllMocks()
        helper.startServer(done)
    })

    afterEach((done)=>{
        helper.unload()
        helper.stopServer(done)
    })

    const FLOW = [{
        id: "test",
        type: "toggl-get-timer",
        name: "",
        toggl: "conf",
        workspace: "1",
        wires: [['out']],
        get_current: true,
    },
    {id:'out', type:'helper'} ,
    {id: "conf", type: "toggl-config", name: "Default" }
    ]
    const CREDS = {conf:{token:"123"}}
    const NODES = [getTimerNode, configNode]

    it('loads', done=>{
        helper.load(NODES, FLOW, CREDS, ()=>{
            let getNode = helper.getNode('test')
            expect(getNode).toBeTruthy()
            expect(getNode).toHaveProperty('type', 'toggl-get-timer')
             
            done()
        })
    })

    it('gets the current time entry by default', done=>{
        helper.load(NODES, FLOW, CREDS, ()=>{
            let node = helper.getNode('test')
            let out = helper.getNode('out')

            out.on('input', (msg)=>{
                expect(MockToggl.getCurrentTimeEntry).toHaveBeenCalled()
                expect(msg).toHaveProperty('payload')
                expect(msg.payload).toEqual(MockToggl.mockData.runningEntry)

                done()
            })

            node.receive()

        })
    })

    it('sets a status if no timer is running', async (done)=>{
        
        MockToggl.getCurrentTimeEntry.mockImplementationOnce(cb=>{cb(null, null)})

        helper.load(NODES, FLOW, CREDS, async()=>{
            let node = helper.getNode('test')
            let out = helper.getNode('out')

            let shouldNotCall = jest.fn()

            out.on('input', shouldNotCall)

            node.receive()

            await waitForExpect(()=>{
                expect(MockToggl.getCurrentTimeEntry).toHaveBeenCalled()
            })
            expect(shouldNotCall).not.toHaveBeenCalled()
            node.status.should.have.been.called()
            let statusArg = node.status.args[0][0]
            expect(statusArg).toMatchObject({shape:"ring", fill:"green", text:expect.stringContaining("no time entry")})

            done()
            
        })
    })
    it("should set an error and error status if an error occurs", done=>{
        MockToggl.getCurrentTimeEntry.mockImplementationOnce(cb=>{cb(Error("Unknown API error"), null)})
        helper.load(NODES, FLOW, CREDS, async()=>{
            let node = helper.getNode('test')
            let out = helper.getNode('out')

            let shouldNotCall = jest.fn()

            out.on('input', shouldNotCall)
            node.receive()

            await waitForExpect(()=>{
                expect(MockToggl.getCurrentTimeEntry).toHaveBeenCalled()
            })
            expect(shouldNotCall).not.toHaveBeenCalled()
            
            node.error.should.have.been.called()

            node.status.should.have.been.called()
            let statusArg = node.status.args[0][0]
            expect(statusArg).toMatchObject({shape:"dot", fill:"red", text:expect.anything()})

            done()
            
        })

    })
    it("should output false when configured to do so for no timer running", done=>{
        MockToggl.getCurrentTimeEntry.mockImplementationOnce(cb=>{cb(null, null)})
        let custom_flow = FLOW
        custom_flow[0].noTimerSendFalse = true

        helper.load(NODES, custom_flow, CREDS, ()=>{
            let node = helper.getNode('test')
            let out = helper.getNode('out')
            
            out.on('input', msg=>{
                expect(MockToggl.getCurrentTimeEntry).toHaveBeenCalled()
                expect(msg).toHaveProperty('payload', false)
                done()
                node.status.should.have.been.called()
                let statusArg = node.status.args[0][0]
                expect(statusArg).toMatchObject({shape:"ring", fill:"green", text:expect.stringContaining("no time entry")})
                done()
            })

            node.receive()
            
        })

    })
})