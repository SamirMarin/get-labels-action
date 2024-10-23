import * as core from '@actions/core';
import { processTrigger } from "./src/action";

async function run() {
    try {
        const labels = await processTrigger();
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();