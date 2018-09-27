import nodeTypes from '../nodes/index'

export default class {
  nodes = new Map()
  channels = new Map()

  run ({ processName = 'default' }) {
    console.log(`NodeManager start for "${processName}"`)
  }

  createNode (config) {
    if (!nodeTypes[config.type]) {
      return null
    }
    const node = new nodeTypes[config.type](config)
    this.nodes.set(node.id, node)
    return node
  }
}
