const isOfType = type => x => typeof x === type

export const isString = isOfType('string')
export const isUndefined = isOfType('undefined')

export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const camelizeRE = /-(\w)/g
export const camelize = cached((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

export const capitalize = cached((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

export function setAttribute(node, key, value) {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

export function warn(msg) {
  console.error(`[Sonder warn]: ${msg} `)
}

export function noop() {
}


function fancyShadowMerge(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    Reflect.defineProperty(target, key, Reflect.getOwnPropertyDescriptor(source, key))
  }
  return target
}

export function inherit(child, parent) {
  const objectPrototype = Object.prototype
  const parentPrototype = Object.create(parent.prototype)
  let childPrototype = child.prototype
  if (Reflect.getPrototypeOf(childPrototype) === objectPrototype) {
    child.prototype = fancyShadowMerge(parentPrototype, childPrototype)
  } else {
    while (Reflect.getPrototypeOf(childPrototype) !== objectPrototype) {
      childPrototype = Reflect.getPrototypeOf(childPrototype)
    }
    Reflect.setPrototypeOf(childPrototype, parent.prototype)
  }
  parentPrototype.constructor = child
}
