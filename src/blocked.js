const BLOCKED_LABEL_NAME = 'blocked'
const DEFAULT_CONFIG = {
  enabled: true,
  label_name: BLOCKED_LABEL_NAME,
  target_url: 'https://github.com/aliou/probot-blocked'
}
const STATUS_MAP = {
  success: {
    state: 'success',
    description: 'This PR is no longer blocked.',
  },
  failure: {
    state: 'failure',
    description: 'This PR is blocked.'
  },
}

const isBlockingLabel = (labelName, blockingLabel) => {
  if (Boolean(labelName) === false) {
    return false
  }

  return labelName === blockingLabel
}

module.exports = async function (robot, context) {
  const payload = context.payload
  const label = payload.label
  const pr = payload.pull_request

  const config = await context.config('blocked.yml', DEFAULT_CONFIG)

  // Return early if the tag is not a blocking one or the blocked thingy is not
  // enabled in the repo.
  if (!isBlockingLabel(label.name, config.label_name) || !config.enabled) return

  // We block the PR when we add the label.
  const isBlocking = payload.action === "labeled"
  const status = isBlocking ? 'failure' : 'success'

  // Build the status params object using the status map above.
  const params = Object.assign({
    sha: pr.head.sha,
    context: 'probot/blocked',
    target_url: config.target_url,
  }, STATUS_MAP[status])

  await context.github.repos.createStatus(context.repo(params))

  robot.log(
    `${isBlocking ? 'Blocked' : 'Unblocked'} PR "${pr.title}" because of label "${label.name}"`
  )
}


