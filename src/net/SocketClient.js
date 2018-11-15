import inputTypes from './inputTypes'
import outputTypes from './outputTypes'
import nodes from '../nodes/index'

export default class {
  constructor ({ socket }) {
    console.log('socket create')
    this.socket = socket
  }

  destroy () {
    for (let [, channel] of global.nodeManager.channels) {
      channel.clients.delete(this)
    }
    console.log('socket destroy')
  }

  send (type, data) {
    switch (type) {
      case outputTypes.SERVER_HELLO: {
        const { name, nodeTypeSupport, nodesCount } = data
        this.sendRaw({
          type,
          name,
          nodeTypeSupport,
          nodesCount
        })
        break
      }
      case outputTypes.NODE_LIST: {
        const { nodeIds } = data
        this.sendRaw({
          type,
          nodeIds
        })
        break
      }
      case outputTypes.NODE_CHANNEL_UPDATE: {
        const { channel } = data
        this.sendRaw({
          type,
          id: channel.id,
          data: channel.data
        })
        break
      }
      case outputTypes.NODE_MIGRATE: {
        this.sendRaw({
          type,
          nodeConfig: data
        })
        break
      }
      default:
        console.error(`Неопределенный тип исходящего пакета "${type}"`)
    }
  }

  sendRaw (data) {
    if (data !== undefined) {
      this.socket.write(JSON.stringify(data))
    }
  }

  async handleRequest (request) {
    console.log('socket handle request')
    const { type } = request
    switch (type) {
      case inputTypes.SERVER_CONNECT: {
        this.send(outputTypes.SERVER_HELLO, {
          name: 'me',
          nodeTypeSupport: Object.keys(nodes),
          nodesCount: global.nodeManager.nodes.size
        })
        break
      }
      case inputTypes.NODE_LIST: {
        this.send(outputTypes.NODE_LIST, {
          nodeIds: Array.from(global.nodeManager.nodes.keys())
        })
        break
      }
      case inputTypes.NODE_CHANNEL_LIST: {
        const { nodeId } = request
        const node = global.nodeManager.nodes.get(nodeId)
        this.send(node.listChannel())
        break
      }
      case inputTypes.NODE_CHANNEL_READ: {
        const { nodeId, channelName } = request
        const node = global.nodeManager.nodes.get(nodeId)
        const channel = node.channels.get(channelName)
        this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
        break
      }
      case inputTypes.NODE_CHANNEL_SEND: {
        const { nodeId, channelName, data } = request
        const node = global.nodeManager.nodes.get(nodeId)
        const channel = node.channels.get(channelName)
        channel.set(data)
        if (!channel.clients.has(this)) {
          this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
        }
        break
      }
      case inputTypes.NODE_CHANNEL_WATCH: {
        const { nodeId, channelName } = request
        const node = global.nodeManager.nodes.get(nodeId)
        const channel = node.channels.get(channelName)
        channel.watch(this)
        this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
        break
      }
      case inputTypes.NODE_CHANNEL_UNWATCH: {
        const { nodeId, channelName } = request
        const node = global.nodeManager.nodes.get(nodeId)
        const channel = node.channels.get(channelName)
        channel.unwatch(this)
        // this.send(null)
        break
      }
      case inputTypes.NODE_MIGRATE: {
        const { nodeId } = request
        const nodeConfig = await global.nodeManager.migrateNode(nodeId)
        if (nodeConfig === false) {
          console.log('Ошибка миграции ноды')
        } else {
          this.send(outputTypes.NODE_MIGRATE, nodeConfig)
        }
        break
      }
      default:
        console.error(`Неопределенный тип входящего пакета "${type}"`)
    }
  }
}
