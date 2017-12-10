/**
 * string to array
 * Usage: {{string2array 'x,y'}}
 *
 * @param {string} str
 * @returns
 */
module.exports = function(str) {
  return str.split(',')
}
