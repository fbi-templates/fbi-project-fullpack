import '../styles/_base.css'
import createInstance from '../wasm/add.wasm'

createInstance()
  .then(m => {
    console.log(m.instance.exports.add(1, 2))
  })
