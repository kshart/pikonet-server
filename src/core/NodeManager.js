/**
 * @author Артём Каширин <kshart@yandex.ru>
 * @fileoverview Module
 */
import nodeTypes from '@/nodes/index'
import NodeComponent from './NodeComponent'

/**
 * Класс для управления нодами
 * @requires module:core.NodeComponent
 * @memberof module:core
 */
class NodeManager {
  constructor () {
    /**
     * Список всех нод.
     * @type {Map<module:node.NodeComponent>}
     */
    this.nodes = new Map()
  }

  /**
   * Создать новую ноду.
   * @param {Object} config - Конфигурация ноды
   * @return {Promise<module:core.NodeComponent>}
   */
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

  /**
   * Расширить NodeComponent
   * @param {String} nodeId - ID ноды
   * @return {Promise<Object>}
   */
  extend (componentConfig) {
    console.log('extend')
    return nodeConfig => new NodeComponent(nodeConfig, componentConfig)
  }
}

export default new NodeManager()
