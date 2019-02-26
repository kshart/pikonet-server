/**
 * @author Артём Каширин <kshart@yandex.ru>
 * @fileoverview Module
 */
import nodes from '@/nodes/index'
import inputTypes from './inputTypes'
import outputTypes from './outputTypes'
import nodeManager from '@/core/NodeManager'
import Channel from '@/core/Channel'

/**
 * Класс предназначен для общения по сокету с клиентами.
 * @requires module:core.Channel
 * @requires module:core.NodeManager
 * @memberof module:net
 */
class Client {
  static delimiter = '\n'
  /**
   * Конструктор клиента для соединения по сокету.
   * @param {Object} config
   * @param {external:"net.Socket"} config.socket
   */
  constructor ({ socket }) {
    /**
     * @type {external:"net.Socket"}
     */
    this.socket = socket
    /**
     * Сырые данные из сокета
     */
    this._rawDataFromSocket = null
    console.log('socket create ' + socket.address())
    socket.setEncoding('utf8')
      .on('connect', () => console.log('connect'))
      .on('data', chunk => {
        const buffer = this._rawDataFromSocket !== null ? this._rawDataFromSocket + chunk : chunk
        const requests = buffer.split(Client.delimiter)
        if (requests.length === 1) {
          this._rawDataFromSocket = requests[0]
        } else if (requests.length > 1) {
          for (let i = 0; i < requests.length - 1; ++i) {
            this.handleRequest(requests[i])
          }
          if (requests[requests.length - 1] !== '') {
            this._rawDataFromSocket = requests[requests.length - 1]
          }
        }
      })
      .on('drain', () => console.log('drain'))
      .on('end', () => this.destroy())
      .on('error', error => console.log(error))
      .on('lookup', (err, address, family, host) => console.log('lookup', err, address, family, host))
      .on('timeout', () => console.log('timeout'))
  }

  /**
   * Деструктор клиента.
   */
  destroy () {
    for (let [, channel] of Channel.channels) {
      channel.clients.delete(this)
    }
    console.log('socket destroy')
  }

  /**
   * Отправить пакет
   * @param {String} type тип пакета
   * @param {Object} payload "полезная нагрузка", зависит от типа пакета
   */
  send (type, payload = {}) {
    this.socket.write(
      JSON.stringify({
        payload,
        type
      }) + Client.delimiter
    )
  }

  /**
   * Обработать запрос
   * @param {String} request Запрос.
   */
  handleRequest (request) {
    if (request.length <= 0) {
      console.log('empty')
      return
    }
    try {
      let { type, payload } = JSON.parse(request)
      const method = 'on' + type.capitalize()
      if (typeof this[method] === 'function') {
        this[method](payload)
      } else {
        console.log(`Метод "${method}" не найден`)
      }
    } catch (error) {
      console.error(error, request)
      this.send('error')
    }
  }

  /**
   * Ошибка
   */
  onError () {
    console.log('error')
  }

  /**
   * Метод возвращает информацию о сервере
   * @see module:net.SERVER_CONNECT_RESULT
   */
  onServerConnect () {
    this.send(outputTypes.serverHello, {
      name: 'me',
      nodeTypeSupport: Object.keys(nodes),
      nodesCount: nodeManager.nodes.size
    })
  }

  /**
   * Метод возвращает список id нод
   * @return {Array<String>} список id доступных нод
   */
  onNodeGetList () {
    this.send(outputTypes.nodeList, {
      nodeIds: Array.from(nodeManager.nodes.keys())
    })
  }

  /**
   * Метод добавляет ноду в пул
   */
  onNodeCreate ({ node }) {
    nodeManager.createNode(node)
      .then(node => node.start())
  }

  /**
   * Метод удаляет ноду из пул
   */
  onNodeRemove ({ nodeId }) {
    nodeManager.removeNode(nodeId)
  }

  /**
   * Метод мигрирует ноду
   */
  onNodeMigrate ({ nodeId }) {
    nodeManager.migrateNode(nodeId)
      .then(nodeConf => console.log(nodeConf))
      .catch(err => console.log(err))
  }

  onNodeGetChannelList ({ nodeId }) {
    const node = nodeManager.nodes.get(nodeId)
    this.send(outputTypes.nodeChannelList, {
      nodeId,
      channels: node.listChannel()
    })
  }
  onNodeChannelRead ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    const { id, data } = channel
    this.send(outputTypes.nodeChannelUpdate, { id, data })
  }
  onNodeChannelSend ({ channelId, data }) {
    const channel = Channel.channels.get(channelId)
    channel.set(data)
    // if (!channel.clients.has(this)) {
    //   const { id, data } = channel
    //   // this.send(outputTypes.nodeChannelUpdate, { channel })
    // }
  }
  onNodeChannelWatch ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    channel.watch(this)
    console.log(channel)
    const { id, data } = channel
    this.send(outputTypes.nodeChannelUpdate, { id, data })
  }
  onNodeChannelUnwatch ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    channel.unwatch(this)
    // this.send(null)
  }
}

export default Client
