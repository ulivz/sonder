// <div class="app">
//    <Counter count="1"></Counter>
// </div>

// function _(h, state) {
//   with (state) {
//     return h('div', { class: 'app' }, [h('Counter'), { count: 1 }])
//   }
// }

export default function compile(template) {
  return new Function('h', 'state', `with (state) {
      return h('div', { class: 'app' }, [h('Counter', { count: 1 })])
    }`)
}



