export default function (target, property, descriptor) {
  if (target.kind !== 'class') {
    return null
  }
  target.elements.push({
    kind: 'field',
    key: 'state',
    placement: 'own',
    descriptor: {
      configurable: false,
      enumerable: true,
      writable: true
    },
    initializer: () => ({})
  })
  if (target.elements.findIndex(el => el.key === 'configToState') < 0) {
    target.elements.push({
      kind: 'method',
      key: 'configToState',
      placement: 'prototype',
      descriptor: {
        value (config) {
          this.state = config
        },
        configurable: false,
        enumerable: false,
        writable: false
      }
    })
  }
  if (target.elements.findIndex(el => el.key === 'stateToConfig') < 0) {
    target.elements.push({
      kind: 'method',
      key: 'stateToConfig',
      placement: 'prototype',
      descriptor: {
        value () {
          return this.state
        },
        configurable: false,
        enumerable: false,
        writable: false
      }
    })
  }
  return target
}
