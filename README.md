# Node-Red nodes for Toggl

Node-Red nodes for starting and stopping Toggl timers.

## Nodes

### Start Timer

This node starts a new timer. It can set the workspace, description, project and tags for the timer. These values can be configured, and overwridden by passing `msg.paylaod`, `msg.project`, or `msg.tags`. Workspaces cannot currently be overridden by `msg` data. Tags can optionally be overridden or merged from those in the node's configuration. Resulting `msg.payload` contains an object representing the Toggl time entry described in the Toggl API docs: [https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#create-a-time-entry](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#create-a-time-entry)

### Stop Timer

Stops the currently running Toggl timer (if there is one). Resulting `msg.payload` contains an object representing the Toggl time entry as described in the Toggl API docs: [https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#stop-a-time-entry](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md#stop-a-time-entry)  

## Planned nodes

- Get Current Timer
- Update Timer
- When Timer Stopped
- When Timer Started