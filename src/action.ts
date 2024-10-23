import * as github from "@actions/github";
import * as core from "@actions/core";
import { Octokit } from "@octokit/core";

export async function processTrigger() {
    let labels;
    if (github.context.eventName === 'pull_request') {
        labels = github.context.payload?.pull_request?.labels || [];
    } else {
        labels = await getPushEventLabels();
    }

    if (labels.length === 0) {
        return labels;
    }

    setOutputs(labels);
}

async function getPushEventLabels() {
    const github_token = core.getInput('github_token');
    if (!github_token) {
        core.error("github_token required for push events");
        return [];
    }

    const octokit = new Octokit({ auth: github_token });

    const pulls = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        commit_sha: github.context.sha,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    return pulls.data[0]?.labels || [];
}

function setOutputs(labels: { name: string }[]) {
    const labelNames = labels.map(label => label.name);
    core.setOutput("labels", labelNames.join(','));

    const labelKey = core.getInput('label_key');
    const keyedValues = labelNames.filter(
        labelName => labelName.startsWith(labelKey + ":")
    ).map(
        keyedLabel => keyedLabel.substring(labelKey.length + 1)
    );

    const valueOrder = core.getInput('label_value_order');
    const valueOrderArray = valueOrder.split(',');
    let outputValue = '';

    for (let value of valueOrderArray) {
        if (keyedValues.includes(value)) {
            outputValue = value;
            break;
        }
    }
    core.info(`Current outputValue: "${outputValue}"`);
    console.log(`Current outputValue: "${outputValue}"`);

    if (!outputValue) {
        core.info("the label value is empty we are here to set it")

        outputValue = keyedValues.length > 0 ? keyedValues.sort()[0] : core.getInput('default_label_value');
    }

    core.setOutput("label_value", outputValue);
}