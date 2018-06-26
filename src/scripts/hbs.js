import '../styles/hbs.css'
import bookListingTemplate from '../templates/partials/book-listing.html'

function logInfo() {
  console.log('fm hbs.js')
  console.log('VERSION: ' + VERSION)
  console.log('COPYRIGHT:' + COPYRIGHT)
}

function renderPartial() {
  const div = document.createElement('div')
  div.innerHTML = bookListingTemplate({
    section: 'Book list:',
    books: [{
      title: 'A book',
      synopsis: 'With a description'
    },
    {
      title: 'Another book',
      synopsis: 'From a very good author'
    },
    {
      title: 'Book without synopsis'
    }
    ]
  })
  document.querySelector('#wrap').appendChild(div)
}

document.addEventListener('DOMContentLoaded', () => {
  logInfo()
  renderPartial()
})
