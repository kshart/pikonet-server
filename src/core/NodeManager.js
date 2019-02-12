import nodeTypes from '@/nodes/index'
import NodeComponent from './NodeComponent'

class NodeManager {
  nodes = new Map()

  createNode (config) {
    if (!nodeTypes[config.type]) {
      return new Promise((resolve, reject) => reject(new Error(`Неопознаный тип ноды ${config.type}`)))
    }
    if (this.nodes.has(config.id)) {
      return new Promise((resolve, reject) => reject(new Error(`Нода "${config.id}" уже существует`)))
    }
    const node = nodeTypes[config.type](config)
    this.nodes.set(node.id, node)
    return new Promise((resolve, reject) => resolve(node))
  }

  removeNode (nodeId) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      return false
    }
    node.beforeRemove()
    node.stop()
    node.remove()
    this.nodes.delete(nodeId)
  }

  migrateNode (nodeId) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      return new Promise((resolve, reject) => reject(new Error('no node')))
    }
    const canMigrate = node.beforeMigrate()
    if (!canMigrate) {
      return new Promise((resolve, reject) => reject(new Error('no Migrate')))
    }
    node.stop()
    const stateConfig = node.stateToConfig()
    node.remove()
    this.nodes.delete(nodeId)
    return new Promise((resolve, reject) => resolve({
      id: nodeId,
      type: node.type,
      stateConfig
    }))
  }

  extend (componentConfig) {
    console.log('extend')
    return nodeConfig => new NodeComponent(nodeConfig, componentConfig)
  }
}

export default new NodeManager()
