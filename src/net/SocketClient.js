import nodes from '@/nodes/index'
import inputTypes from './inputTypes'
import outputTypes from './outputTypes'
import nodeManager from '@/core/NodeManager'
import Channel from '@/core/Channel'

export default class {
  /**
   * @type {net.Socket}
   */
  socket = null

  constructor ({ socket }) {
    console.log('socket create ' + socket.address())
    this.socket = socket
  }

  destroy () {
    for (let [, channel] of Channel.channels) {
      channel.clients.delete(this)
    }
    console.log('socket destroy')
  }

  /**
   * Отправить пакет
   */
  send (type, payload = {}) {
    this.socket.write(
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

  /**
   * @typedef {Object} SERVER_CONNECT_RESULT
   * @property {String} name имя текущего сервера
   * @property {Array<String>} nodeTypeSupport список доступных типов нод
   * @property {Number} nodesCount колличество нод у сервера
   */
  /**
   * Метод возвращает информацию о сервере
   * @return {SERVER_CONNECT_RESULT}
   */
  [inputTypes.SERVER_CONNECT] () {
    this.send(outputTypes.SERVER_HELLO, {
      name: 'me',
      nodeTypeSupport: Object.keys(nodes),
      nodesCount: nodeManager.nodes.size
    })
  }

  /**
   * Метод возвращает список id нод
   * @return {Array<String>} список id доступных нод
   */
  [inputTypes.NODE_GET_LIST] () {
    this.send(outputTypes.NODE_LIST, {
      nodeIds: Array.from(nodeManager.nodes.keys())
    })
  }

  /**
   * Метод добавляет ноду в пул
   */
  [inputTypes.NODE_CREATE] ({ node }) {
    nodeManager.createNode(node)
      .then(node => node.start())
  }

  /**
   * Метод удаляет ноду из пул
   */
  [inputTypes.NODE_REMOVE] ({ nodeId }) {
    nodeManager.removeNode(nodeId)
  }

  /**
   * Метод мигрирует ноду
   */
  [inputTypes.NODE_MIGRATE] ({ nodeId }) {
    nodeManager.migrateNode(nodeId)
      .then(nodeConf => console.log(nodeConf))
      .catch(err => console.log(err))
  }

  [inputTypes.NODE_GET_CHANNEL_LIST] ({ nodeId }) {
    const node = nodeManager.nodes.get(nodeId)
    this.send(outputTypes.NODE_CHANNEL_LIST, {
      nodeId,
      channels: node.listChannel()
    })
  }
  [inputTypes.NODE_CHANNEL_READ] ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    const { id, data } = channel
    this.send(outputTypes.NODE_CHANNEL_UPDATE, { id, data })
  }
  [inputTypes.NODE_CHANNEL_SEND] ({ channelId, data }) {
    const channel = Channel.channels.get(channelId)
    channel.set(data)
    // if (!channel.clients.has(this)) {
    //   const { id, data } = channel
    //   // this.send(outputTypes.NODE_CHANNEL_UPDATE, { channel })
    // }
  }
  [inputTypes.NODE_CHANNEL_WATCH] ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    channel.watch(this)
    console.log(channel)
    const { id, data } = channel
    this.send(outputTypes.NODE_CHANNEL_UPDATE, { id, data })
  }
  [inputTypes.NODE_CHANNEL_UNWATCH] ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    channel.unwatch(this)
    // this.send(null)
  }
}
