const core = require('@actions/core');
const github = require('@actions/github');
import {processTrigger} from "./src/action";

async function run() {
    try {
        const labelPrefix = core.getInput('label_prefix');
        const labels = processTrigger()
        core.setOutput("label_value", labels);
        console.log(`the labels are ${labels}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();