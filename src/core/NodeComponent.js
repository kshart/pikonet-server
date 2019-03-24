import Channel from './Channel'

/**
 * Конфигурация для создания ноды.
 * @typedef {Object} NodeConfig
 * @prop {String} id - ID ноды.
 * @prop {String} type - Тип ноды.
 * @memberof core
 */

/**
 * Шаблон для нод
 * @requires core.Channel
 * @memberof core
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class NodeComponent {
  /**
   * Конструктор ноды
   * @param {core.NodeConfig} nodeConfig - Конфигурация ноды.
   */
  constructor (nodeConfig) {
    console.log('NodeComponent')

    /**
     * ID ноды
     * @type {String}
     */
    this.id = nodeConfig.id

    /**
     * Тип ноды.
     * Список доступных типов нод @see авы
     * @type {String}
     */
    this.type = nodeConfig.type

    /**
     * Список каналов у ноды.
     * @type {Map<core.Channel>}
     */
    this.channels = new Map()
  }

  /**
   * Список каналов у ноды.
   * @return {Array<{ name: String, id:String }>}
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
   * @param {core.ChannelConfig} config - Конфигурация ноды.
   * @return {core.Channel}
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
   * @param {String} name - Имя канала
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
   * @return {Boolean}
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
