const core = require("@actions/core");
const github = require("@actions/github");

try {
  const github_token = core.getInput("GITHUB_TOKEN");
  const Labels = core.getInput("labels").split(",");
  const labelsObject = github.context.payload.issue.labels;
  const octokit = github.getOctokit(github_token);

  let issueLabels = [];

  labelsObject.forEach((item, index) => issueLabels.push(item.name));

  let missingLabels = [];

  for (let index = 0; index < Labels.length; index++) {
    if (issueLabels.includes(Labels[index])) {
    } else {
      missingLabels.push(Labels[index]);
    }
  }

  if (missingLabels.length > 1) {
    missingLabelsString = missingLabels.join(", ");
    const message =
      "The following label **" +
      missingLabelsString +
      "** does not exist on the issue. Please add these labels to avoid any inconvenience in future.";

    octokit.rest.issues.createComment({
      issue_number: github.context.issue.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: message,
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
