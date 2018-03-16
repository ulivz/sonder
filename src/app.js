import { SonderDOM } from './index'
import Counter from './Counter'

SonderDOM.render(
  `<div class="app">
      <Counter count="1">1234</Counter>
   </div>`,
  document.getElementById('app'),
  { Counter }
)

// new Sonder({
//   el: '#app',
//   render: h => h(Counter)
// })
