const github = require("@actions/github");
const core = require("@actions/core");

async function processTrigger() {

    let labels
    if (github.context.eventName === 'pull_request'){
        labels = github.context.payload?.pull_request?.labels
    } else {
        labels = await getPushEventLabels()
    }

}

async function getPushEventLabels() {
    const github_token = core.getInput('github_token');
    if (github_token === '') {
        core.error("github_token required for push events")
    }
    const url  = `https://api.github.com/repos/${github.context.repo.owner}/${github.context.repo.repo}/commits/${github.context.sha}/pulls`
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${github}`
        }
    })

}