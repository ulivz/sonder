import el, { diff }  from '../src/vdom/element'

// <ul id='list'>
//   <li class='item'>Item 1</li>
// <li class='item'>Item 2</li>
// <li class='item'>Item 3</li>
// </ul>

const ul1 = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['Item 1']),
  el('li', { class: 'item' }, ['Item 2']),
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

console.log(diff(ul1, ul2))


