export class VNode {
  constructor(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }

  render(scopeComponents = {}, componentInstances = {}, parent = null) {
    if (scopeComponents && scopeComponents[this.tagName]) {
      let componentConstructor = scopeComponents[this.tagName]
      let componentInstance = new componentConstructor()
      componentInstance.$parent = parent
      componentInstances.push(componentInstance)
      const div = document.createElement('div')
      div.innerHTML = componentInstance.render()
      return div
    }

    const el = document.createElement(this.tagName)
    const props = this.props

    if (props) {
      for (const [propName, propValue] of Object.entries(props)) {
        el.setAttribute(propName, propValue)
      }
    }

    if (this.children) {
      for (const child of this.children) {
        const childEl = child instanceof VNode
          ? child.render(scopeComponents, componentInstances, parent)
          : document.createTextNode(child)
        el.appendChild(childEl)
      }
    }

    return el
  }
}

export function h(...props) {
  return new VNode(...props)
}

