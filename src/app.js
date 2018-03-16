import Sounder from './index'
import Counter from './Counter'

new Sounder({
  el: '#app',
  render: h => h(Counter)
})
