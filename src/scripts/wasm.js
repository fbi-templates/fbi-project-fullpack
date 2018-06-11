import '../styles/_base.css'
import createInstance from '../wasm/add'

createInstance({
    // 'global': {},
    // 'env': {
    //   'memory': new Memory({initial: 10, limit: 100}),
    //   'table': new Table({initial: 0, element: 'anyfunc'})
    // }
  })
  .then(m => {
    console.log(m.instance.exports.add(1, 2))
  })
