# sonder

[![NPM version](https://img.shields.io/npm/v/sonder.svg?style=flat)](https://npmjs.com/package/sonder) [![NPM downloads](https://img.shields.io/npm/dm/sonder.svg?style=flat)](https://npmjs.com/package/sonder) [![CircleCI](https://circleci.com/gh/ULIVZ/sonder/tree/master.svg?style=shield)](https://circleci.com/gh/ULIVZ/sonder/tree/master)  [![codecov](https://codecov.io/gh/ULIVZ/sonder/branch/master/graph/badge.svg)](https://codecov.io/gh/ULIVZ/sonder)
 [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/ULIVZ/donate)

## Install

```bash
npm i sonder
```

## Usage

Create a Counter component:

```js
export default class Counter {

  render() {
    return `Clicked: {{ count }} times, count is {{ evenOrOdd }}.
    <button click="increment">+</button>
    <button click="decrement">-</button>
    <button click="incrementIfOdd">Increment if odd</button>
    <button click="incrementAsync">Increment async</button>`
  }

  constructor() {
    this.state = {
      count: 0
    }
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

```

Render it:

```js
import Sounder from './index'
import Counter from './Counter'

new Sounder({
  el: '#app',
  render: h => h(Counter)
})
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**sonder** © [ulivz](https://github.com/ULIVZ), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by ulivz with help from contributors ([list](https://github.com/ULIVZ/sonder/contributors)).

> [github.com/ulivz](https://github.com/ulivz) · GitHub [@ulivz](https://github.com/ULIVZ)
