/* @jsx h */
import { h, app } from 'hyperapp'

app({
  init: 0,
  view: state =>
    h('div', {}, [
      h('h2', {}, state),
      h('button', { onClick: state => state - 1 }, 'Decrement'),
      h('button', { onClick: state => state + 1 }, 'Increment')
    ]),
  node: document.body.appendChild(document.createElement('div'))
})
