import { isString } from '../utils'
import { REPLACE, PROPS, REORDER } from './patch'
import listDiff  from 'list-diff2'

const NO_UPDATE_PROP_NAME = 'no-update'

/**
 * Diff two VElement
 * @param oldNode
 * @param newNode
 * @returns {{}}
 */
function diff(oldNode, newNode) {
  const index = 0
  const patches = {}
  deepFirstWalk(oldNode, newNode, index, patches)
  return patches
}

/**
 * Diff two VElement's props
 * @param {VElement} oldNode
 * @param {VElement} newNode
 * @returns { [key: string]: any }
 */
function diffProps(oldNode, newNode) {
  let count = 0
  const oldProps = oldNode.props
  const newProps = newNode.props
  const propsPatches = {}

  for (const oldKey of Reflect.keys(oldProps)) {
    if (newProps[oldKey] !== oldProps[oldKey]) {
      count++
      propsPatches[oldKey] = oldProps[oldKey]
    }
  }

  for (const newKey of Reflect.keys(newProps)) {
    if (!oldProps.hasOwnProperty(newKey)) {
      count++
      propsPatches[newKey] = newProps[newKey]
    }
  }

  if (count === 0) {
    return null
  }

  return propsPatches
}

/**
 * Deep first walk
 * @param {VElement} oldNode
 * @param {VElement} newNode
 * @param {number} index
 * @param {object} patches
 */
function deepFirstWalk(oldNode, newNode, index, patches) {
  const currentPatch = []

  // Node is removed.
  if (oldNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here.
  } else if (isString(oldNode) && isString(newNode)) {
    // TextNode content replacing
    if (newNode !== oldNode) {
      currentPatch.push({ type: REPLACE, content: newNode })
    }
    // Nodes are the same, diff old node's props and children
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    // Diff props
    const propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: PROPS, props: propsPatches })
    }
    // Diff children. If the node has a `ignore` property, do not diff children.
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
    // Nodes are not the same, replace the old node with new node
  } else {
    currentPatch.push({ type: REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  const diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children
  if (diffs.moves.length) {
    var reorderPatch = { type: REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }

  let leftNode = null
  let currentNodeIndex = index

  for (const [oldChildIndex, oldChild] of oldChildren.entries()) {
    const newChild = newChildren[oldChildIndex]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    deepFirstWalk(oldChild, newChild, currentNodeIndex, patches)
    leftNode = oldChild
  }
}


function isIgnoreChildren(node) {
  return node.props && node.props.hasOwnProperty(NO_UPDATE_PROP_NAME)
}



