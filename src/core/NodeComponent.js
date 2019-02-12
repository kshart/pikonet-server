import nodeManager from '@/core/NodeManager'
import Channel from './Channel'

const defineReadOnlyProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    configurable: false,
    writable: false,
    value
  })
}

class NodeComponent {
  channels = new Map()
  constructor (nodeConfig, componentConfig) {
    console.log('NodeComponent')
    defineReadOnlyProp(this, 'id', nodeConfig.id)
    defineReadOnlyProp(this, 'type', nodeConfig.type)
    this.config = nodeConfig
    for (let key in componentConfig) {
      this[key] = componentConfig[key]
    }
    this.init(nodeConfig)
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
    console.log('createChannel')
    return channel
  }

  removeChannel (name) {
    const channel = this.channels.get(name)
    this.channels.delete(name)
    channel.destroy()
    return true
  }

  stateToConfig () {
    return null
  }

  channelsToConfig () {
    const channels = {}
    for (let [ id, channel ] of this.channels) {
      channels[id] = channel.toJson()
    }
    return { channels }
  }

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

export default NodeComponent
