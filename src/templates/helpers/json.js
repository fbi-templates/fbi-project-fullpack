/**
 * json stringify
 * Usage: {{json obj}}
 *
 * @param {object} obj
 * @returns
 */
module.exports = function(obj) {
  return JSON.stringify(obj, null, 2)
}
