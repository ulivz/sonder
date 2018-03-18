class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)
  }

  walk(value) {
    Object.keys(value).forEach(key => this.convert(key, value[key]))
  }

  convert(key, value) {
    defineReactive(this.value, key, value)
  }
}

function defineReactive(obj, key, value) {
  let dep = new Dep()
  let childObserver = observe(value)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      // 说明这是watch 引起的
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return value
    },
    set: newVal => {
      if (newVal === value) {
        return
      }
      childObserver = observe(newVal)//如果新赋值的值是个复杂类型。再递归它，加上set/get。。
      dep.notify()
    }
  })
}


function observe(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}


class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.cd = cb
    this.vm = vm
    this.expOrFn = expOrFn
    this.value = this.get()
  }

  update() {
    this.run()
  }

  run() {
    const value = this.get()
    if (value !== this.value) {
      this.value = value
      this.cb.call(this.vm)
    }
  }

  get() {
    Dep.target = this
    //此处简化。。要区分fuction还是expression
    const value = this.vm._data[this.expOrFn]
    Dep.target = null
    return value
  }
}


class Vue {
  constructor(options = {}) {
    this.$options = options
    let data = this._data = this.$options.data
    Object.keys(data).forEach(key => this._proxy(key))
    observe(data, this)
  }

  $watch(expOrFn, cb, options) {
    new Watcher(this, expOrFn, cb)
  }

  _proxy(key) {
    var self = this
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return self._data[key]
      },
      set: function proxySetter(val) {
        self._data[key] = val
      }
    })
  }
}

const v = new Vue({
  data: {
    a: 1,
    b: 2
  }
})

v.$watch('a', () => console.log('Watch 成功'))

console.log(v)

setTimeout(() => {
  v.a = 5
}, 2000)

