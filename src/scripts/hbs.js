import '../styles/hbs.css'

console.log('fm hbs.js')
console.log('VERSION: ' + VERSION)
console.log('COPYRIGHT:' + COPYRIGHT)

async function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('log from promise')
    }, 500)
  })
}

a()
