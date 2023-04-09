const core = require('@actions/core');
const github = require('@actions/github');
import {processTrigger} from "./src/action";

async function run() {
    try {
        const labels = await processTrigger()
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();