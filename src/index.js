import compiler from './compiler'
import h from './vdom/element'
import diff from './vdom/diff'
import { isString } from './utils'


class SonderDOM {

  /**
   *
   * @param {string} template
   * @param {HTMLElement} slot
   * @param { [key: string]: VElement } scopeComponents
   */
  static render(template, slot, scopeComponents) {
    const vnodeFn = compiler(template)
    const rootComponent = Sonder.createComponentByVnodeFn(vnodeFn)
    rootComponent.setScopeComponents(scopeComponents)

    console.log(vnodeFn)
    console.log(rootComponent)
    console.log(rootComponent.vnode)
    // const componentInstance = []
    //
    // slot.appendChild(vnode.render(scopeComponents, componentInstance))
    //
    // console.log(componentInstance)
  }
}

class Component {
  // static createComponentBy

  constructor(state) {
    this.state = state || {}
    this.$components = {}
    this.$children = []
    this.$scopeComponents = {}
  }

  setVnodeFn(vnodeFn) {
    this.$vnodeFn = vnodeFn
  }

  setScopeComponents(scopeComponents) {
    this.$scopeComponents = Object.assign(this.setScopeComponents, scopeComponents)
  }

  intializeComponent(componentName, props) {
    const childComponentConstructor = this.$scopeComponents[componentName]
    const childComponent = new childComponentConstructor(props)
    childComponent.$parent = childComponent
    this.$children.push(childComponent)
    return childComponent
  }

  get vnode() {
    return this.$vnodeFn(h, this.intializeComponent.bind(this), this.state)
  }
}

class Sonder {

  static createComponentByVnodeFn(vnodeFn) {
    const component = new Component()
    component.setVnodeFn(vnodeFn)
    return component
  }

}

Sonder.Component = Component

export default Sonder

export {
  SonderDOM
}
