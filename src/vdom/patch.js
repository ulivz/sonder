import { isString, isUndefined, setAttribute } from '../utils'

export const REPLACE = 0
export const REORDER = 1
export const PROPS = 2
export const TEXT = 3

/**
 * Update dom by patches.
 * @param {HTMLElement} node
 * @param {Patch[]} patches
 */
export default function patch(node, patches) {
  const walker = { index: 0 }
  deepFirstWalk(node, walker, patches)
}

/**
 * Deep first walk.
 * @param {HTMLElement} node
 * @param {Object} walker
 * @param {Patch[]} patches
 */
function deepFirstWalk(node, walker, patches) {
  const currentPatches = patches[walker.index]
  if (node.childNodes.length) {
    for (const childNode of node.childNodes) {
      walker.index++
      deepFirstWalk(childNode, walker, patches)
    }
  }
  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

/**
 * Apply patches
 * @param {HTMLElement} node
 * @param {Patch[]} patches
 */
function applyPatches(node, currentPatches) {
  for (const currentPatch of currentPatches) {
    switch (currentPatch.type) {
      case REPLACE:
        const newNode = isString(currentPatch.node)
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        updateProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // IE
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error(`Unknown patch type ${currentPatch.type}`)
    }
  }
}

const MOVE_TYPE = {
  REMOVE: 0,
  INSERT: 1
}

const NODE_TYPE = {
  ELEMENT: 1,
  ATTRIBUTE: 1
}

/**
 * Reorder children.
 * @param {HTMLElement} node
 * @param {Move[]} patches
 */
function reorderChildren(node, moves) {
  const staticNodeList = [...node.childNodes]
  const maps = {}

  for (const childNode of staticNodeList) {
    if (childNode.nodeType === NODE_TYPE.ELEMENT) {
      maps[childNode.getAttribute('key')] = childNode
    }
  }

  for (const move of moves) {
    const index = move.index

    // Remove
    if (move.type === MOVE_TYPE.REMOVE) {
      // maybe have been removed for inserting
      if (staticNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    }

    // Insert
    else if (move.type === MOVE_TYPE.INSERT) {
      const insertNode = maps[move.item.key]
        ? maps[move.item.key].cloneNode(true)
        : typeof move.item === 'object'
          ? move.item.render()
          : document.createTextNode(move.item)

      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  }
}

/**
 * Update props
 * @param {HTMLElement} node
 * @param {Object} props
 */
function updateProps(node, props) {
  for (const [propName, propValue] of props.entries()) {
    if (isUndefined(propValue)) {
      node.removeAttribute(propName)
    } else {
      setAttribute(node, propName, propValue)
    }
  }
}
