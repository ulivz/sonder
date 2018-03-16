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


export function diff(oldTree, newTree) {
  const index = 0 // Current node's label.
  const patch = {} // Used to record every node's difference.
  deepFirstWalk(oldTree, newTree, index, patch)
  return patch
}

function deepFirstWalk(oldNode, newNode, index, patch) {
  patch[index] = []

}

function diffChildren(oldChildren, newChildren, index, patch) {
  let leftNode = null
  let currentNodeIndex = index
  for (const [i, child] of oldChildren.entries()) {
    const newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    deepFirstWalk(child, newChild, currentNodeIndex, patch)
    leftNode = child
  }
}

export default (...props) => new Element(...props)

