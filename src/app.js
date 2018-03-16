import Sonder from './index'
import Counter from './Counter'

new Sonder({
  el: '#app',
  render: h => h(Counter)
})
