import { SonderDOM } from './index'
import Counter from './components/Counter'
import { compileToFunctions } from './compiler'
import { h } from './vdom-2'

// SonderDOM.render(
//   `<div class="app">
//       <Counter count="1">1234</Counter>
//    </div>`,
//   document.getElementById('app'),
//   { Counter }
// )

const res = compileToFunctions(`<div class="app"><Counter count="1">1234</Counter></div>`, { $options: {} })

console.log(res)

const context = {
  _h: h
}

console.log(res.call(context))

// new Sonder({
//   el: '#app',
//   render: h => h(Counter)
// })
