const blocked = require('./src/blocked')

module.exports = (robot) => {
  robot.on(
    ['pull_request.labeled', 'pull_request.unlabeled'],
    context => blocked(robot, context)
  )
}
