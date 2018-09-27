import Channel from './Channel'
import State from './State'

@State
class Node {
  id = null
  channels = new Map()

  constructor ({ id }) {
    this.id = id
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
    global.nodeManager.channels.set(channel.id, channel)
    return channel
  }

  removeChannel (name) {
    const { id } = this.channels.get(name)
    global.nodeManager.channels.delete(id)
    this.channels.delete(name)
    return true
  }

  migrateFrom () {
    const canMigrate = await this.beforeMigrate()
    if (!canMigrate) {
      return false
    }
    const res = {
      id: 1,
      stateConfig: 1,
      channels: []
    }
  }

  migrateTo () {

  }

  init () {
  }

  remove () {
  }

  start () {
  }

  stop () {
  }
  // configToState () {
  //   return 444
  // }
}

export default Node
