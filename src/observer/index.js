/*!
 * sonder-observer v0.0.1
 * (c) 2014-2018 ULIVZ
 * Released under the MIT License.
 */

class Observer {
  constructor(data, key) {
    this._key = key || null
    this._data = data
    this._subs = []
    this._subnObservers = {}
    this._parent = null
  }

  _update(key, newValue, oldValue, source) {
    if (source) {
      Observer.paths.unshift(source)
    }
    for (let sub of this._subs) {
      sub && sub(key, newValue, oldValue, [...Observer.paths, key].join('.'))
    }
    let parent = this._parent
    if (!parent) {
      Observer.paths = []
    }
    if (parent !== null) {
      parent._update(key, newValue, oldValue, this._key)
    }
  }

  observe(fn) {
    this._subs.push(fn)
    return this
  }

  watch(key, fn) {
    this._subs.push(((_key, newValue, oldValue, source) => {
      if (key === source) {
        fn && fn(newValue, oldValue)
      }
    }))
    return this
  }
}

Observer.paths = []

function defineReactive(data, observer) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(observer, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        if (observer._subnObservers[key]) {
          return observer._subnObservers[key]
        }
        return data[key]
      },
      set: newValue => {
        let oldValue = data[key]
        if (newValue === data[key]) {
          return
        }
        data[key] = newValue
        observer._update(key, newValue, oldValue)
      }
    })
    if (typeof data[key] === 'object') {
      const childObserver = observable(data[key], key)
      childObserver._parent = observer
      observer._subnObservers[key] = childObserver
    }
  })
}

export default function observable(data, key) {
  const observer = new Observer(data, key)
  defineReactive(data, observer)
  return observer
}
