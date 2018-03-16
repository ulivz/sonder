import el  from '../src/vdom/element'
import diff  from '../src/vdom/diff'
import patch  from '../src/vdom/patch'

// <ul id='list'>
//   <li class='item'>Item 1</li>
// <li class='item'>Item 2</li>
// <li class='item'>Item 3</li>
// </ul>

const ul1 = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['Item 1', el('div', { class: 'child' }, ['123'])]),
  el('li', { class: 'item' }, ['Item 21']),
  el('li', { class: 'item' }, ['Item 3'])
])

const ul2 = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['']),
  el('li', { class: 'item' }, ['Item 2']),
  el('li', { class: 'item' }, ['Item 3'])
])

var ul1El = ul1.render()
document.body.appendChild(ul1El)

var ul2El = ul2.render()
document.body.appendChild(ul2El)

const patches = diff(ul2, ul1)

console.log(patches)

setTimeout(() => {
  patch(ul2El, patches)
}, 1000)



