import outputTypes from '@/net/outputTypes'

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
export default class Channel {
  static channels = new Map()

  /**
   * @param {core.ChannelConfig} config - Конфигурация канала.
   */
  constructor ({ node, name, writable = false, data = null }) {
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

    /**
     * Список клиентов подписаных на обновление канала.
     * @type {Set<net.Client>}
     */
    this.clients = new Set()

    Channel.channels.set(this.id, this)
  }

  /**
   * Деструктор канала.
   */
  destroy () {
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
    for (let client of this.clients) {
      client.send(outputTypes.NODE_CHANNEL_UPDATE, {
        id: this.id,
        data
      })
    }
  }

  /**
   * Подписка на изменение данных в канале
   * @param {net.Client} client внешний клиент
   */
  watch (client) {
    this.clients.add(client)
  }

  /**
   * Отписка от изменения данных в канале
   * @param {net.Client} client внешний клиент
   */
  unwatch (client) {
    this.clients.delete(client)
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
