const rimraf = require('rimraf')

module.exports = target => {
  const dir = target.trim()
  if (!dir || dir === '/') {
    // for safety
    return
  }

  return new Promise((resolve, reject) => {
    rimraf(dir, err => {
      return err ? reject(err) : resolve()
    })
  })
}
