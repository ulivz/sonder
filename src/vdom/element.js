class VElement {
  constructor(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }

  render() {
    const el = document.createElement(this.tagName)
    const props = this.props

    for (const [propName, propValue] of Object.entries(props)) {
      el.setAttribute(propName, propValue)
    }

    if (this.children) {
      for (const child of this.children) {
        const childEl = child instanceof VElement
          ? child.render()
          : document.createTextNode(child)
        el.appendChild(childEl)
      }
    }

    return el
  }
}

export default (...props) => new VElement(...props)

