class VElement {
  constructor(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }

  render(Components = {}, instances = {}) {
    if (Components && Components[this.tagName]) {
      let Component = Components[this.tagName]
      let component = instances[this.tagName] = new Component()
      const div = document.createElement('div')
      div.innerHTML = component.render()
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
        const childEl = child instanceof VElement
          ? child.render(Components, instances)
          : document.createTextNode(child)
        el.appendChild(childEl)
      }
    }

    return el
  }
}

export default (...props) => new VElement(...props)

