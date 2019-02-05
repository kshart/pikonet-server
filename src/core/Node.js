import nodeManager from '@/core/NodeManager'
import Channel from './Channel'

class Node {
  id = null
  type = null
  channels = new Map()

  constructor ({ id, type }) {
    this.id = id
    this.type = type
  }

  listChannel () {
    const result = []
    for (let [name, { id }] of this.channels) {
      result.push({ name, id })
    }
    return result
  }

  createChannel (config) {
    const channel = new Channel({
      node: this,
      ...config
    })
    this.channels.set(channel.name, channel)
    nodeManager.channels.set(channel.id, channel)
    return channel
  }

  removeChannel (name) {
    const { id } = this.channels.get(name)
    nodeManager.channels.delete(id)
    this.channels.delete(name)
    return true
  }

  beforeMigrate () {
  }

  init () {
  }

  remove () {
  }

  start () {
  }

  stop () {
  }
}

export default Node
