import outputTypes from '@/net/outputTypes'
import EventEmitter from 'events'

/**
 * Конфигурация для создания канала.
 * @typedef {Object} ChannelConfig
 * @prop {core.NodeComponent} node - Нода для которой создается канал.
 * @prop {string}  name - Имя канала.
 * @prop {boolean} writable - Доступ на запись.
 * @prop {Object}  data - Данные.
 * @memberof core
 */

/**
 * Канал - способ общения между нодами.
 * @requires net.Client
 * @memberof core
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Channel extends EventEmitter {
  static channels = new Map()

  /**
   * @param {core.ChannelConfig} config - Конфигурация канала.
   */
  constructor ({ node, name, writable = false, data = null }) {
    super()
    this.id = `${node.id}/${name}`

    /**
     * Имя канала.
     * @type {String}
     */
    this.name = name

    /**
     * Данные.
     * @type {Object}
     */
    this.data = data

    /**
     * Доступ на запись.
     * @type {Boolean}
     */
    this.writable = !!writable

    Channel.channels.set(this.id, this)
  }

  /**
   * Деструктор канала.
   */
  destructor () {
    this.removeAllListeners('change')
    Channel.channels.delete(this.id)
  }

  /**
   * Метод возвращает текущее значение канала
   */
  get () {
    return this.data
  }

  /**
   * Метод записывает значение в канал
   */
  set (data) {
    if (!this.writable) {
      return
    }
    this.data = data
    if (this.listenerCount('change') > 0) {
      this.emit('change', {
        channelId: this.id,
        data
      })
    }
  }

  toJson () {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      writable: this.writable
    }
  }
}
global.Channel = Channel
