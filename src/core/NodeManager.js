import nodeTypes from '@/nodes/index'

class NodeManager {
  nodes = new Map()
  channels = new Map()

  /**
   * @deprecated
   */
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

  async migrateNode (nodeId) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      return false
    }
    const canMigrate = await node.beforeMigrate()
    if (!canMigrate) {
      return false
    }
    node.stop()
    const channels = {}
    for (let [ id, channel ] of node.channels) {
      channels[id] = channel.toJson()
    }
    node.remove()
    this.nodes.delete(nodeId)
    // node to migration list
    return {
      id: nodeId,
      type: node.type,
      stateConfig: node.stateToConfig(),
      channels
    }
  }
}

export default new NodeManager()
