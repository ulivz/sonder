import { init, h } from 'snabbdom'
import VNode from 'snabbdom/vnode'
import htmlDomApi from 'snabbdom/htmldomapi'

import klass from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import attrs from 'snabbdom/modules/attributes'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

const patch = init([klass, props, attrs, style, eventlisteners])
const { createElement } = htmlDomApi

export {
  createElement,
  VNode,
  patch,
  h,
}

