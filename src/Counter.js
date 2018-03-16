import Sonder from './sonder'

export default class Counter extends Sonder.Component {

  constructor() {
    super()
    this.state = {
      count: 0
    }
  }

  render() {
    return `Clicked: {{ count }} times, count is {{ evenOrOdd }}.
    <button click="increment">+</button>
    <button click="decrement">-</button>
    <button click="incrementIfOdd">Increment if odd</button>
    <button click="incrementAsync">Increment async</button>`
  }

  increment() {
    this.state.count++
  }

  decrement() {
    this.state.count--
  }

  incrementIfOdd() {
    if ((this.state.count + 1) % 2 === 0) {
      this.increment()
    }
  }

  incrementAsync() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.increment()
        resolve()
      }, 1000)
    })
  }

  get evenOrOdd() {
    return this.state.count % 2 === 0 ? 'even' : 'odd'
  }
}
