module.exports = obj => {
  const copy = JSON.parse(JSON.stringify(obj))

  Object.keys(copy).map(item => {
    copy[item] =
      typeof item === 'string' ? JSON.stringify(copy[item]) : copy[item]
  })

  return copy
}
