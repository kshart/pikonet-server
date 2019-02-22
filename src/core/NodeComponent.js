/**
 * @author Артём Каширин <kshart@yandex.ru>
 * @fileoverview Module
 */
import Channel from './Channel'

const defineReadOnlyProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    configurable: false,
    writable: false,
    value
  })
}

/**
 * Конфигурация для создания ноды.
 * @typedef {Object} NodeConfig
 * @prop {string} id - ID ноды.
 * @prop {string} type - Тип ноды.
 * @memberof module:core
 */

/**
 * Шаблон для нод
 * @requires module:core.Channel
 * @memberof module:core
 */
export default class NodeComponent {
  /**
   * Конструктор ноды
   * @param {module:core.NodeConfig} nodeConfig - Конфигурация ноды.
   * @param {module:core.NodeComponentConfig} componentConfig - Конфигурация компонента.
   */
  constructor (nodeConfig, componentConfig) {
    console.log('NodeComponent')
    /**
     * ID ноды
     * @type {String}
     */
    this.id = nodeConfig.id

    /**
     * Тип ноды.
     * Список доступных типов нод @see ass
     * @type {String}
     */
    this.type = nodeConfig.type

    /**
     * Конфигурация ноды.
     * @type {Object}
     */
    this.config = nodeConfig

    /**
     * Список каналов у ноды.
     * @type {Map<module:core.Channel>}
     */
    this.channels = new Map()
    for (let key in componentConfig) {
      this[key] = componentConfig[key]
    }
    this.init(nodeConfig)
  }

  /**
   * Список каналов у ноды.
   * @return {Array<{ name: string, id:string }>}
   */
  listChannel () {
    const result = []
    for (let [name, { id }] of this.channels) {
      result.push({ name, id })
    }
    return result
  }

  /**
   * Создать новый канал у ноды.
   * @param {module:core.ChannelConfig} config - Конфигурация ноды.
   * @return {module:core.Channel}
   */
  createChannel (config) {
    const channel = new Channel({
      node: this,
      ...config
    })
    this.channels.set(channel.name, channel)
    console.log('createChannel')
    return channel
  }

  /**
   * Удалить канал.
   * @param {string} name - Имя канала
   */
  removeChannel (name) {
    const channel = this.channels.get(name)
    this.channels.delete(name)
    channel.destroy()
    return true
  }

  /**
   * Преобразовать конфигурацию ноды в Object.
   * @return {Object}
   */
  stateToConfig () {
    return null
  }

  /**
   * Метод возвращает конфигурацию каналов.
   * @return {Object}
   */
  channelsToConfig () {
    const channels = {}
    for (let [ id, channel ] of this.channels) {
      channels[id] = channel.toJson()
    }
    return { channels }
  }

  /**
   * Хук вызывается перед миграцией
   *  true - продолжить миграцию
   *  false - прервать миграцию
   * @return {boolean}
   */
  beforeMigrate () {
    return true
  }

  beforeRemove () {
  }

  init () {
  }

  update () {
  }

  remove () {
  }

  start () {
  }

  stop () {
  }
}
