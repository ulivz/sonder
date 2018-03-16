import compiler from './compiler'
import h from './vdom/element'
import diff from './vdom/diff'

class SonderDOM {
  static render(template, slot, components) {
    let renderFn = compiler(template)
    const velement = renderFn(h, {})
    const instances = {}
    slot.appendChild(velement.render(components, instances))
    console.log(instances)
  }
}

class Component {
  constructor() {

  }
}

class Sonder {
  constructor() {

  }
}

Sonder.Component = Component

export default Sonder

export {
  SonderDOM
}
