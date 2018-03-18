import { observable, observe } from '@nx-js/observer-util'
import { h, patch, VNode, createElement } from './vdom-2'
import { compileToFunctions } from './compiler'
import {
  bind,
  noop,
  warn,
  query,
  getOuterHTML,
  idToTemplate,
  toString,
  isString,
  isArray,
  isObject,
  isFunction,
  resolveAsset
} from './utils'

const BEFROE_CREATE = 'beforeCreate'
const CREATED = 'created'
const BEFORE_MOUNT = 'beforeMount'
const MOUNTED = 'mounted'
const BEFORE_UPDATE = 'beforeUpdate'
const UPDATED = 'updated'

export default function Sonder(options) {
  this.$options = options
  callHook(this, BEFROE_CREATE)

  const { data, methods, el } = options
  if (data) {
    initData(this, data)
  }
  if (methods) {
    initMethods(this, methods)
  }

  callHook(this, CREATED)
  this.$mount(el)
}

Sonder.prototype.$mount = function (el) {
  this.$el = el = el && query(el)
  let { render, template, _isComponent } = this.$options

  // 1. If render function doesn't exists, then read template.
  // 2. If template is ID selector string, then assign the real dom
  // element to template.
  // 3. Else if template is already dom elmeent, assign its innerHTML
  // to template. <template/>
  // 4. Else if If el is already dom elmeent, assign it to template.
  // 5. Finally: render template to get render function, and assign it
  // to this.$options.
  if (!render) {
    if (template) {
      if (isString(template)) {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      const render = compileToFunctions(template, this)
      // console.log(render)
      this.$options.render = render
    }
  } else {
    const Ctor = this.constructor
    const Factory = (options) => new Ctor(options)
    const ins = render(Factory)
    console.log(ins)

  }

  callHook(this, BEFORE_MOUNT)

  // When _isComponent is false ...
  if (!_isComponent) {
    observe(() => {
      this._update(this._render())
    })
  }

  if (!this._vnode) {
    this._isMounted = true
    callHook(this, MOUNTED)
  }

  return this
}

Sonder.prototype.$forceUpdate = function () {
  this._update(this._render())
}

Sonder.prototype._render = function () {
  const { render } = this.$options
  let vnode
  try {
    vnode = render.call(this, h)
  } catch (e) {
    warn(`render Error : ${e}`)
  }
  // console.log(JSON.stringify(vnode))
  return vnode
}

Sonder.prototype._update = function (vnode) {
  if (!vnode || !vnode.sel) {
    warn(`_update without vnode`)
  }
  if (this._isMounted) {
    callHook(this, BEFORE_UPDATE)
  }
  const prevVnode = this._vnode || this.$options._vnode
  this._vnode = vnode

  if (!prevVnode) {
    this.$el = this._patch(this.$el, vnode)
  } else {
    this.$el = this._patch(prevVnode, vnode)
  }

  if (this._isMounted) {
    callHook(this, UPDATED)
  }
}

Sonder.prototype._patch = patch

Sonder.prototype._createComponent = function (Ctor, data, children, sel) {
  Ctor = mergeOptions(Ctor)
  Ctor._isComponent = true
  let Factory = this.constructor
  let parentData = this.$data

  data.hook.init = (vnode) => {
    Ctor.data = Ctor.data || {}

    let componentVm = new Factory(Ctor)

    // Props
    for (const [attrKey, attrValue] of Object.entries(data.attrs)) {
      console.log(attrKey, attrValue)
      Object.defineProperty(componentVm, attrKey, {
        configurable: true,
        enumerable: true,
        get() {
          return attrValue
        }
      })
    }

    observe(() => {
      componentVm.$forceUpdate()
    })

    vnode._component = componentVm
  }

  Ctor._vnode = new VNode(sel, data, [], undefined, createElement(sel))
  return Ctor._vnode
}

Sonder.prototype._s = toString

Sonder.prototype._h = function (sel, data, children) {
  data = data || {}

  // Support (sel, children)
  if (isArray(data)) {
    children = data
    data = {}
  }

  data.hook = data.hook || {}

  if (this.$options.destroy) {
    // Refer to https://github.com/snabbdom/snabbdom#hooks
    data.hook.destroy = bind(this.$options.destroy, this)
  }

  if (isArray(children)) {
    let flatChildren = []

    children.forEach((item) => {
      if (isArray(item)) {
        flatChildren = flatChildren.concat(item)
      } else {
        flatChildren.push(item)
      }
    })

    children = flatChildren.length ? flatChildren : children
  }

  if (isString(sel)) {
    let Ctor = resolveAsset(this.$options, 'components', sel)
    if (Ctor) {
      let instance = this._createComponent(Ctor, data, children, sel)
      return instance
    }
  }

  return h(sel, data, children)
}

Sonder.prototype._k = function (eventKeyCode, key, builtInAlias) {
  const keyCodes = builtInAlias
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

Sonder.prototype._l = function (val, render) {
  let ret, i, l, keys, key
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  } else if (isObject(val)) {
    keys = Object.keys(val)
    ret = new Array(keys.length)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      ret[i] = render(val[key], key, i)
    }
  }
  return ret
}

function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.call(vm)
  }
}

function initData(vm, data) {
  vm.$data = observable(data)
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    let key = keys[i]
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get() {
        return vm.$data[key]
      },
      set(val) {
        vm.$data[key] = val
      }
    })
  }
}

function initMethods(vm, methods) {
  for (const [name, method] of Object.entries(methods)) {
    vm[name] = method == null ? noop : bind(method, vm)
  }
}

function mergeOptions(options) {
  let opt = Object.assign({}, options)
  let data = opt.data
  if (isFunction(data)) {
    opt.data = data()
  }
  return opt
}
