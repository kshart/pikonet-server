import outputTypes from '@/net/outputTypes'

export default class {
  clients = new Set()

  constructor ({ node, name, writable = false, data = null }) {
    this.id = `${node.id}/${name}`
    this.name = name
    this.data = data
    this.writable = !!writable
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
      client.send(outputTypes.NODE_CHANNEL_UPDATE, { channel: this })
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
