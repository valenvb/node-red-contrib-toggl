MockToggle = jest.fn(()=>MockToggle)
MockToggle.mockData = {
    runningEntry: {
        "id":436694100,
		"wid":777,
		"pid":193791,
		"billable":false,
		"start":"2014-01-30T09:08:04+00:00",
		"duration":-1391072884,
		"description":"Running time entry",
		"at":"2014-01-30T09:08:12+00:00"
    },
    timeEntry: {
        "id":436694100,
		"pid":123,
		"wid":777,
		"billable":false,
		"start":"2013-03-05T07:58:58.000Z",
		"duration":1200,
		"description":"Meeting with possible clients",
		"tags":["billed"]
    },
    timeEntry2: {
        "id":436694100,
		"wid":777,
		"pid":193791,
		"tid":13350500,
		"billable":false,
		"start":"2013-02-27T01:24:00+00:00",
		"stop":"2013-02-27T07:24:00+00:00",
		"duration":21600,
		"description":"Some serious work",
		"tags":["billed"],
		"at":"2013-02-27T13:49:18+00:00"
    },
    entries: [
        {
            "id":436691234,
            "wid":777,
            "pid":123,
            "billable":true,
            "start":"2013-03-11T11:36:00+00:00",
            "stop":"2013-03-11T15:36:00+00:00",
            "duration":14400,
            "description":"Meeting with the client",
            "tags":["a", "tag"],
            "at":"2013-03-11T15:36:58+00:00"
        },{
            "id":436776436,
            "wid":777,
            "billable":false,
            "start":"2013-03-12T10:32:43+00:00",
            "stop":"2013-03-12T14:32:43+00:00",
            "duration":18400,
            "description":"important work",
            "tags":[""],
            "at":"2013-03-12T14:32:43+00:00"
        }
    ],
    workspaces: [
        {
            "id":3134975,
            "name":"John's personal ws",
            "premium":true,
            "admin":true,
            "default_hourly_rate":50,
            "default_currency":"USD",
            "only_admins_may_create_projects":false,
            "only_admins_see_billable_rates":true,
            "rounding":1,
            "rounding_minutes":15,
            "at":"2013-08-28T16:22:21+00:00",
            "logo_url":"my_logo.png"
        },{
            "id":777,
            "name":"My Company Inc",
            "premium":true,
            "admin":true,
            "default_hourly_rate":40,
            "default_currency":"EUR",
            "only_admins_may_create_projects":false,
            "only_admins_see_billable_rates":true,
            "rounding":1,
            "rounding_minutes":15,
            "at":"2013-08-28T16:22:21+00:00"
        }
    ],
    singleWorkspace: {
        "id":3134975,
		"name":"John's personal ws",
		"premium":true,
		"admin":true,
		"default_hourly_rate":150,
		"default_currency":"USD",
		"only_admins_may_create_projects":false,
		"only_admins_see_billable_rates":false,
		"rounding":1,
		"rounding_minutes":15,
		"at":"2013-08-28T16:22:21+03:00",
		"logo_url":"my_logo.png"
    }
}
MockToggle.getWorkspaces = jest.fn(cb=>cb(null, MockToggle.mockData.workspaces))
MockToggle.startTimeEntry = jest.fn((d, cb)=>cb(null, d))
MockToggle.getCurrentTimeEntry = jest.fn(cb=>{cb(null,MockToggle.mockData.runningEntry)})
MockToggle.getTimeEntries = jest.fn((start, end, cb)=>{cb(null,MockToggle.mockData.entries)})


module.exports = MockToggle