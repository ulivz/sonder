import { SonderDOM } from './index'
import Counter from './components/Counter'
import { compileToFunctions } from './compiler'

// SonderDOM.render(
//   `<div class="app">
//       <Counter count="1">1234</Counter>
//    </div>`,
//   document.getElementById('app'),
//   { Counter }
// )

const res = compileToFunctions(`<div class="app">
       <Counter count="1">1234</Counter>
    </div>`, { $options: {} })

console.log(res)

// new Sonder({
//   el: '#app',
//   render: h => h(Counter)
// })
