'use strict'

const symbols = require('./symbols')
const anchors = new Set()

window.addEventListener('route', onRoute)
window.addEventListener('popstate', onPopstate)

function onRoute (ev) {
  if (!ev.defaultPrevented) {
    for (let anchor of anchors) {
      updateRouteMatch(anchor, ev.detail.to, ev.target.$routerLevel)
    }
  }
}

function onPopstate () {
  anchors.forEach(updateParamsMatch)
}

function register (anchor) {
  anchors.add(anchor)
}

function unregister (anchor) {
  anchors.delete(anchor)
}

function updateRouteMatch (anchor, view, level) {
  const config = anchor[symbols.config]
  const route = config.route

  if (route) {
    if (route[level] === view) {
      config.routeMismatches.delete(level)
    } else if (route[level]) {
      config.routeMismatches.add(level)
    }
  }
  updateActivity(anchor)
}

function updateParamsMatch (anchor) {
  const config = anchor[symbols.config]
  const anchorParams = config.params

  if (anchorParams) {
    const params = history.state.params
    for (let key in anchorParams) {
      if (anchorParams[key] !== params[key]) {
        config.paramsMatch = false
        return updateActivity(anchor)
      }
    }
  }
  config.paramsMatch = true
  updateActivity(anchor)
}

function updateActivity (anchor) {
  const config = anchor[symbols.config]
  if (config.routeMismatches.size || !config.paramsMatch) {
    anchor.classList.remove('active')
  } else {
    anchor.classList.add('active')
  }
}

module.exports = {
  register,
  unregister,
  updateRouteMatch,
  updateParamsMatch
}
