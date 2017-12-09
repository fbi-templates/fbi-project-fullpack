/**
 * Make plugins array
 * input:
 * {
 *  pluginA: {optsA},
 *  pluginB: {optsB}
 * }
 * output:
 * [
 *  require(pluginA)(optsA),
 *  require(pluginB)(optsB)
 * ]
 * 
 * @param {Object} configs 
 * @returns 
 */
module.exports = configs => {
  const keys = Object.keys(configs)
  if (!keys || keys.length < 1) {
    return []
  }

  return keys.map(item => {
    return require(item)(configs[item])
  })
}
