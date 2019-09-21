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
     * @type {Map<core.NodeComponent>}
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
      return new Promise((resolve, reject) => reject(new Error(`NodeManager.createNode Неопознаный тип ноды ${config.type}`)))
    }
    if (this.nodes.has(config.id)) {
      return new Promise((resolve, reject) => reject(new Error(`NodeManager.createNode Нода "${config.id}" уже существует`)))
    }
    console.log(`NodeManager.createNode ${config.type} ${config.id}`)
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
      console.log(`NodeManager.removeNode: Нода ${nodeId} не найдена`)
      return false
    }
    node.beforeRemove()
    node.stop()
    node.remove()
    this.nodes.delete(nodeId)
  }

  updateNode (nodeId, config) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      console.log(`NodeManager.updateNode: Нода ${nodeId} не найдена`)
      return false
    }
    node.update(config)
  }

  /**
   * Миграция ноды.
   * @param {String} nodeId - ID ноды
   * @return {Promise<Object>}
   */
  migrateNode (nodeId) {
    const node = this.nodes.get(nodeId)
    if (!node) {
      return new Promise((resolve, reject) => reject(new Error(`NodeManager.migrateNode Нода "${nodeId}" не найдена`)))
    }
    const canMigrate = node.beforeMigrate()
    if (!canMigrate) {
      return new Promise((resolve, reject) => reject(new Error(`NodeManager.migrateNode Нода "${nodeId}" не может мигрировать`)))
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
