import outputTypes from '@/net/outputTypes'
import SocketClient from '@/net/SocketClient'

export default class Channel {
  static channels = new Map()

  /**
   * @type {Set<SocketClient>}
   */
  clients = new Set()

  constructor ({ node, name, writable = false, data = null }) {
    this.id = `${node.id}/${name}`
    this.name = name
    this.data = data
    this.writable = !!writable
    Channel.channels.set(this.id, this)
  }

  destroy () {
    Channel.channels.delete(this.id)
  }

  get () {
    return this.data
  }

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

  watch (client) {
    this.clients.add(client)
    console.log(this.clients.size)
  }

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
