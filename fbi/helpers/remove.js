const rimraf = require('rimraf')

module.exports = target => {
  const dir = target.trim()

  return !dir || dir === '/'
    ? null
    : new Promise((resolve, reject) =>
        rimraf(dir, err => (err ? reject(err) : resolve()))
      )
}
