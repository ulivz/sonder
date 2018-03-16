import el  from '../src/vdom/element'
import diff  from '../src/vdom/diff'
import patch  from '../src/vdom/patch'

// <ul id='list'>
//   <li class='item'>Item 1</li>
// <li class='item'>Item 2</li>
// <li class='item'>Item 3</li>
// </ul>

const ul1 = el('ul', { id: 'list' }, [
  el('li', { class: 'item', key: 1 }, ['Item 1', el('div', { class: 'child' }, ['I am the inderted content'])]),
  el('li', { class: 'item', key: 2 }, ['Item 2 Updated']),
  el('li', { class: 'item updated', key: 3 }, ['Item 3'])
])

const div1 = el('div', { id: 'app updated' }, [ul1])

const ul2 = el('ul', { id: 'list' }, [
  el('li', { class: 'item', key: 1 }, ['']),
  el('li', { class: 'item', key: 2 }, ['Item 2']),
  el('li', { class: 'item', key: 3 }, ['Item 3'])
])

const div2 = el('div', { id: 'app' }, [ul2])

var div1El = div1.render()
document.body.appendChild(div1El)

var div2El = div2.render()
document.body.appendChild(div2El)

const patches = diff(div2, div1)

console.log(patches)
console.log(JSON.stringify(patches))

setTimeout(() => {
  patch(div2El, patches)
}, 1000)



