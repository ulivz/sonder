import compiler from './compiler'
import h from './vdom/element'
import diff from './vdom/diff'

class SonderDOM {
  static render(template, slot, components) {
    let renderFn = compiler(template)
    const velement = renderFn(h, {})
    const instances = {}
    console.log(velement.render(components, instances))
    slot.appendChild(velement.render(components, instances))
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
