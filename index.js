const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const labelPrefix = core.getInput('label_prefix');
        const time = (new Date()).toTimeString();
        core.setOutput("label_value", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);

        core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();