import nodeTypes from '@/nodes/index'

class NodeManager {
  nodes = new Map()
  channels = new Map()

  createNode (config) {
    if (!nodeTypes[config.type]) {
      return null
    }
    const node = new nodeTypes[config.type](config)
    this.nodes.set(node.id, node)
    return node
  }

  migrateNode (nodeId) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      return false
    }
    const canMigrate = node.beforeMigrate()
    if (!canMigrate) {
      return false
    }
    node.stop()
    const channels = {}
    for (let [ id, channel ] of node.channels) {
      channels[id] = channel.toJson()
    }
    const stateConfig = node.stateToConfig()
    node.remove()
    this.nodes.delete(nodeId)
    return {
      id: nodeId,
      type: node.type,
      stateConfig,
      channels
    }
  }
}

export default new NodeManager()
