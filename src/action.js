const github = require("@actions/github");
const core = require("@actions/core");
const { Octokit } = require("@octokit/core");
const {error} = require("@actions/core");

export async function processTrigger() {
    let labels
    if (github.context.eventName === 'pull_request'){
        labels = github.context.payload?.pull_request?.labels
    } else {
        console.log('getting push event label');
        labels = await getPushEventLabels()
    }

    return labels
}

async function getPushEventLabels() {
    const github_token = core.getInput('github_token');
    if (github_token === '') {
        core.error("github_token required for push events")
        return
    }
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: github_token
    })

    const pulls = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        commit_sha: github.context.sha,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    console.log('this is the pull');
    console.log(pulls);
    return pulls.data[0].labels
}