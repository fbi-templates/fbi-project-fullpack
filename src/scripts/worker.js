import '../styles/_base.css'
import MyWorker from './workers/sample.worker.js'

const worker = new MyWorker()
worker.postMessage('ping')
worker.onmessage = (event) => {
  console.log(event.data)
}
