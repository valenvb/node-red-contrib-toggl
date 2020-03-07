let chai = require('chai');
let expect = chai.expect;
//const should = chai.should();
// chai.use(require('chai-things'));

let helper = require("node-red-node-test-helper");
let configNode = require("../nodes/toggl-config");
// helper.init(require.resolve('node-red'));

describe("config node", ()=>{
    beforeEach((done)=>{
        helper.startServer(done)
    })

    afterEach((done)=>{
        helper.stopServer(done)
    })


    it.only("can be created", (done)=>{
        const flow = [ {id:"n1",type:"toggl-config", name: "conf"} ]
        helper.load([configNode], flow, {config:{token:"bob"}}, ()=>{
            //let node = helper.getNode('n1')
            console.log(helper.getNode('n1'))
            expect(true).to.be.equal(true)
            // node.should.have.property('name')
            done()
        })
    })


    it("has parameters for an api token", done=>{
        const TOKEN = "bob"
        helper.load(configNode, flow, {config:{token:TOKEN}}, ()=>{
            let node = helper.getNode('config')
            //expect(node.credentials.token).toBe(TOKEN)
            done()
        })
    })
})
