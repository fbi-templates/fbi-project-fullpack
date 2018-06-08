import '../styles/_base.css'

function greeter(person) {
  return 'Hello, ' + person
}

const user = 'new User'

document.querySelector('#text').innerHTML = greeter(user)
