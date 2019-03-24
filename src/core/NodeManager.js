import nodeTypes from '@/nodes/index'

/**
 * Класс для управления нодами
 * @requires core.NodeComponent
 * @memberof core
 * @author Артём Каширин <kshart@yandex.ru>
 */
class NodeManager {
  constructor () {
    /**
     * Список всех нод.
     * @type {Map<node.NodeComponent>}
     */
    this.nodes = new Map()
  }

  /**
   * Создать новую ноду.
   * @param {Object} config - Конфигурация ноды
   * @return {Promise<core.NodeComponent>}
   */
  createNode (config) {
    if (!nodeTypes[config.type]) {
      return new Promise((resolve, reject) => reject(new Error(`Неопознаный тип ноды ${config.type}`)))
    }
    if (this.nodes.has(config.id)) {
      return new Promise((resolve, reject) => reject(new Error(`Нода "${config.id}" уже существует`)))
    }
    const node = new nodeTypes[config.type](config)
    this.nodes.set(node.id, node)
    return new Promise((resolve, reject) => resolve(node))
  }

  /**
   * Удалить ноду.
   * @param {String} nodeId - ID ноды
   */
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

  /**
   * Миграция ноды.
   * @param {String} nodeId - ID ноды
   * @return {Promise<Object>}
   */
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
}

export default new NodeManager()
