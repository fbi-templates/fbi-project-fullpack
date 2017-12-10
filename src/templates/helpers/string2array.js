/**
 * string to array
 * Usage: {{string2array 'x,y'}}
 *
 * @param {string} str
 * @returns
 */
module.exports = str => str.split(',').filter(i => i.trim())
