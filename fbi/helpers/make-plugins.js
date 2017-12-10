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

  return !keys || keys.length < 1
    ? []
    : keys.map(item => require(item)(configs[item]))
}
