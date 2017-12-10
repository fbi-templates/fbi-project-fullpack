import '../styles/index.css'

console.log('from `index.js`')

function ajax({url, method = 'GET'} = {}) {
  if (!url) {
    throw new Error('plz give me a url')
  }
  const xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.responseText)
      }
    }
    xhr.open(method, url, true)
    xhr.send(null)
  })
}

ajax({
  url: `${API_ROOT}/users/fbi-templates/repos`
}).then(res => {
  if (!res) {
    return
  }
  const data = JSON.parse(res)
  const $tmplList = document.querySelector('#tmplList')
  const $taskList = document.querySelector('#taskList')

  let taskHtml = ''
  let tmplHtml = ''
  data.map(item => {
    const isTask = item.name.startsWith('fbi-task')
    const color = isTask ? 'green' : 'yellow'
    const html = `<li>
      <a class="item" title="${item.name}" target="_blank" href="${item.html_url}">
        <span class="ico-fav ${color}">★</span>
        ${item.name}
        <span class="item-desc">${item.description}</span>
      </a>
    </li>`

    if (isTask) {
      taskHtml += html
    } else {
      tmplHtml += html
    }
  })

  $taskList.innerHTML = taskHtml
  $tmplList.innerHTML = tmplHtml
})
