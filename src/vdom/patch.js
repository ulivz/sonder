import { isString, isUndefined, setAttribute } from '../utils'

export const REPLACE = 0
export const REORDER = 1
export const PROPS = 2
export const TEXT = 3

export default function patch(node, patches) {
  const walker = { index: 0 }
  deepFirstWalk(node, walker, patches)
}

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
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  }
}

const MOVE_REMOVE = 0
const MOVE_INSERT = 1

function reorderChildren(node, moves) {
  const staticNodeList = [...node.childNodes]
  const maps = {}

  for (const childNode of staticNodeList) {
    if (childNode.nodeType === 1) {
      maps[childNode.getAttribute('key')] = childNode
    }
  }

  for (const move of moves) {
    const index = move.index

    // Remove
    if (move.type === MOVE_REMOVE) {
      // maybe have been removed for inserting
      if (staticNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    }

    // Insert
    else if (move.type === MOVE_INSERT) {
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

function setProps(node, props) {
  for (const [propName, propValue] of props.entries()) {
    if (isUndefined(propValue)) {
      node.removeAttribute(propName)
    } else {
      setAttribute(node, propName, propValue)
    }
  }
}
