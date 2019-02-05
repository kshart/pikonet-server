import nodes from '@/nodes/index'
import inputTypes from './inputTypes'
import outputTypes from './outputTypes'
import nodeManager from '@/core/NodeManager'

export default class {
  constructor ({ socket }) {
    console.log('socket create')
    this.socket = socket
  }

  destroy () {
    for (let [, channel] of nodeManager.channels) {
      channel.clients.delete(this)
    }
    console.log('socket destroy')
  }

  /**
   * Отправить пакет
   */
  send (type, payload = {}) {
    this.socket.send(
      JSON.stringify({
        ...payload,
        type
      })
    )
  }

  handleRequest (request) {
    const { type, ...payload } = request
    if (typeof this[type] !== 'function') {
      console.error(`Неопределенный тип входящего пакета "${type}"`)
      return
    }
    this[type](payload)
  }

  [inputTypes.SERVER_CONNECT] () {
    this.send(outputTypes.SERVER_HELLO, {
      name: 'me',
      nodeTypeSupport: Object.keys(nodes),
      nodesCount: nodeManager.nodes.size
    })
  }
  [inputTypes.NODE_LIST] () {
    this.send(outputTypes.NODE_LIST, {
      nodeIds: Array.from(nodeManager.nodes.keys())
    })
  }
  [inputTypes.NODE_CHANNEL_LIST] ({ nodeId }) {
    const node = nodeManager.nodes.get(nodeId)
    this.send(node.listChannel())
  }
  [inputTypes.NODE_CHANNEL_READ] ({ nodeId, channelName }) {
    const node = nodeManager.nodes.get(nodeId)
    const channel = node.channels.get(channelName)
    this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
  }
  [inputTypes.NODE_CHANNEL_SEND] ({ nodeId, channelName, data }) {
    const node = nodeManager.nodes.get(nodeId)
    const channel = node.channels.get(channelName)
    channel.set(data)
    if (!channel.clients.has(this)) {
      this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
    }
  }
  [inputTypes.NODE_CHANNEL_WATCH] ({ nodeId, channelName }) {
    const node = nodeManager.nodes.get(nodeId)
    const channel = node.channels.get(channelName)
    channel.watch(this)
    this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
  }
  [inputTypes.NODE_CHANNEL_UNWATCH] ({ nodeId, channelName }) {
    const node = nodeManager.nodes.get(nodeId)
    const channel = node.channels.get(channelName)
    channel.unwatch(this)
    // this.send(null)
  }
  [inputTypes.NODE_MIGRATE] ({ nodeId }) {
    nodeManager.migrateNode(nodeId).then(nodeConfig => {
      if (nodeConfig === false) {
        console.log('Ошибка миграции ноды')
      } else {
        this.send(outputTypes.NODE_MIGRATE, { nodeConfig })
      }
    })
  }
}
