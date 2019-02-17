import outputTypes from '@/net/outputTypes'

/**
 * Канал - способ общения между нодами.
 */
export default class Channel {
  static channels = new Map()

  /**
   * @type {Set<net.SocketClient>}
   */
  clients = new Set()

  /**
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   * @param {number} width - The width of the dot, in pixels.
   */
  constructor ({ node, name, writable = false, data = null }) {
    this.id = `${node.id}/${name}`
    this.name = name
    this.data = data
    this.writable = !!writable
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
   * @param {net.SocketClient} client внешний клиент
   */
  watch (client) {
    this.clients.add(client)
    console.log(this.clients.size)
  }

  /**
   * Отписка от изменения данных в канале
   * @param {net.SocketClient} client внешний клиент
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
