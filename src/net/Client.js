import nodes from '@/nodes/index'
import Channel from '@/core/Channel'
import outputTypes from './outputTypes'
import nodeManager from '@/core/NodeManager'
import EventEmitter from 'events'

/**
 * Класс предназначен для общения по сокету с клиентами.
 * @requires core.Channel
 * @requires core.NodeManager
 * @memberof net
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Client {
  /**
   * Клиенты.
   * @type {Set<net.Client>}
   */
  static clients = new Set()

  constructor ({ connection }) {
    /**
     * @type {net.connections.Connection}
     */
    this.connection = connection
    this.lastResposeId = 0
    connection
      .on('connect', () => console.log('connect'))
      .on('message', message => this.handleRequest(message))
      .on('close', () => this.destroy())
      .on('error', error => console.log(error))

    Client.clients.add(this)
  }

  /**
   * Деструктор клиента.
   */
  destroy () {
    for (let [, channel] of Channel.channels) {
      channel.unwatch(this)
    }
    Client.clients.delete(this)
    console.log('Client destroy')
  }

  get name () {
    return this.connection.getName()
  }

  /**
   * Отправить пакет
   * @param {String} method - Тип пакета.
   * @param {Object} params - "полезная нагрузка", зависит от типа пакета.
   * @param {String} requestId - ID запроса, для которого предназначен этот ответ.
   */
  send (method, params = {}, requestId = null) {
    this.lastResposeId++
    this.connection.send({
      id: this.lastResposeId,
      requestId,
      method,
      params
    })
  }

  /**
   * Обработать запрос
   * @param {Object} request Запрос.
   */
  handleRequest ({ id, requestId, method, params }) {
    const methodName = 'on' + method.capitalize()
    if (typeof this[methodName] === 'function') {
      this[methodName](params, { id, requestId })
    } else {
      console.log(`Метод "${methodName}" не найден`)
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
  onServerConnect (params, { id }) {
    this.send(outputTypes.serverHello, {
      name: 'me',
      nodeTypeSupport: Object.keys(nodes),
      nodesCount: nodeManager.nodes.size
    }, id)
  }

  /**
   * Метод возвращает список id нод.
   * @return {Array<String>} список id доступных нод
   */
  onNodeGetList (params, { id }) {
    this.send(outputTypes.nodeList, {
      nodeIds: Array.from(nodeManager.nodes.keys())
    }, id)
  }

  /**
   * Метод добавляет ноду в пул.
   */
  onNodeCreate ({ node }) {
    nodeManager.createNode(node)
      .then(node => node.start())
  }

  /**
   * Обновить конфигурацию ноды.
   */
  onNodeUpdated ({ nodeId, node }) {
    nodeManager.updateNode(nodeId, node)
  }

  /**
   * Метод удаляет ноду из пул
   */
  onNodeDeleted ({ nodeId }) {
    nodeManager.removeNode(nodeId)
  }

  /**
   * Метод мигрирует ноду.
   */
  onNodeMigrate ({ nodeId }) {
    nodeManager.migrateNode(nodeId)
      .then(nodeConf => console.log(nodeConf))
      .catch(err => console.log(err))
  }

  onNodeGetChannelList ({ nodeId }, { id }) {
    const node = nodeManager.nodes.get(nodeId)
    if (!node) {
      this.send(outputTypes.error, {
        message: `[server] node '${nodeId}' not found`,
      }, id)
      return
    }
    this.send(outputTypes.nodeChannelList, {
      nodeId,
      channels: node.listChannel()
    }, id)
  }

  onNodeChannelRead ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    const { id, data } = channel
    this.send(outputTypes.nodeChannelUpdate, { id, data })
  }

  onNodeChannelSend ({ channelId, data }) {
    const channel = Channel.channels.get(channelId)
    channel.set(data)
  }

  onNodeChannelsSendData ({ channelsData }) {
    for (let channelId in channelsData) {
      const data = channelsData[channelId]
      const channel = Channel.channels.get(channelId)
      channel.set(data)
    }
  }

  onNodeChannelsWatch ({ channelsId }) {
    for (let channelId of channelsId) {
      const channel = Channel.channels.get(channelId)
      if (!channel) {
        console.error(`Канал "${channelId}" не найден.`)
        continue
      }
      channel.watch(this)
      const { id, data } = channel
      this.send(outputTypes.nodeChannelUpdate, { id, data })
    }
  }

  onNodeChannelUnwatch ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    channel.unwatch(this)
  }
}
global.Client = Client
