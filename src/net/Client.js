import nodes from '@/nodes/index'
import Channel from '@/core/Channel'
import outputTypes from './outputTypes'
import nodeManager from '@/core/NodeManager'

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
    this.serverChannelUpdate = ({ channelId, data }) => {
      this.send(outputTypes.nodeChannelUpdate, {
        id: channelId,
        data
      })
    }
    /**
     * @type {net.connections.Connection}
     */
    this.connection = connection
    this.lastResposeId = 0
    connection
      .on('connect', () => console.log('connect'))
      .on('message', message => this.handleRequest(message))
      .on('close', () => this.destructor())
      .on('error', error => console.log(error))

    Client.clients.add(this)
  }

  /**
   * Деструктор клиента.
   */
  destructor () {
    for (let [, channel] of Channel.channels) {
      channel.off('change', this.serverChannelUpdate)
    }
    Client.clients.delete(this)
    console.log('Client destructor')
  }

  /**
   * Имя соединения.
   */
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
   * @param {Object} request - Запрос.
   * @param {String} request.id - ID запроса.
   * @param {String} request.requestId
   * @param {String} request.method - Имя метода.
   * @param {Object} request.params - Параметры метода.
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
   * Ошибка на клиенте
   */
  onError () {
    console.log('error')
  }

  /**
   * Метод возвращает информацию о сервере
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
   * @return {Array<String>} - список id доступных нод
   */
  onNodeGetList (params, { id }) {
    this.send(outputTypes.nodeList, {
      nodeIds: Array.from(nodeManager.nodes.keys())
    }, id)
  }

  /**
   * Метод добавляет ноду в пул.
   * @param {Object} conf
   * @param {Object} conf.node - Конфигурация Ноды.
   */
  onNodeCreate ({ node }) {
    nodeManager.createNode(node)
      .then(node => node.init())
      .catch(err => {
        console.error(err)
        // Отправить сообщение об ошибке
      })
  }

  /**
   * Обновить конфигурацию ноды.
   * @param {Object} conf
   * @param {String} conf.nodeId - ID Ноды.
   * @param {Object} conf.node - Конфигурация Ноды.
   */
  onNodeUpdated ({ nodeId, node }) {
    nodeManager.updateNode(nodeId, node)
  }

  /**
   * Метод удаляет ноду из пул
   * @param {Object} conf
   * @param {String} conf.nodeId - ID Ноды.
   */
  onNodeDeleted ({ nodeId }) {
    nodeManager.removeNode(nodeId)
  }

  /**
   * Мигрировать ноду.
   * @TODO написать миграцию
   * @param {Object} conf
   * @param {String} conf.nodeId - ID Ноды.
   */
  onNodeMigrate ({ nodeId }) {
    nodeManager.migrateNode(nodeId)
      .then(nodeConf => console.log(nodeConf))
      .catch(err => console.log(err))
  }

  /**
   * Получить список каналов у ноды.
   * @param {Object} conf
   * @param {String} conf.nodeId - ID Ноды.
   * @param {Object} request
   * @param {String} request.id - ID Запроса.
   */
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

  /**
   * Прочитать данные из канала.
   * @param {Object} conf
   * @param {String} conf.channelId - ID канала.
   */
  onNodeChannelRead ({ channelId }) {
    const channel = Channel.channels.get(channelId)
    const { id, data } = channel
    this.send(outputTypes.nodeChannelUpdate, { id, data })
  }

  /**
   * Отправить данные в канал.
   * @param {Object} conf
   * @param {String} conf.channelId - ID канала.
   * @param {any} conf.data - данные для записи.
   */
  onNodeChannelSend ({ channelId, data }) {
    const channel = Channel.channels.get(channelId)
    channel.set(data)
  }

  /**
   * Отправить данные в каналы.
   * @param {Object} conf
   * @param {Map<String, any>} conf.channelsData - ID канала и данные для записи.
   */
  onNodeChannelsSendData ({ channelsData }) {
    for (let channelId in channelsData) {
      const data = channelsData[channelId]
      const channel = Channel.channels.get(channelId)
      channel.set(data)
    }
  }

  /**
   * Зарегистрировать надсмотрщики над каналами.
   * @param {Object} conf
   * @param {Array<String>} conf.channelsId - Список ID каналов.
   */
  onNodeChannelsWatch ({ channelsId }) {
    for (let channelId of channelsId) {
      const channel = Channel.channels.get(channelId)
      if (!channel) {
        console.error(`Канал "${channelId}" не найден.`)
        continue
      }
      channel.on('change', this.serverChannelUpdate)
      const { id, data } = channel
      this.send(outputTypes.nodeChannelUpdate, { id, data })
    }
  }

  /**
   * Отписать надсмотрщики от каналов.
   * @param {Object} conf
   * @param {Array<String>} conf.channelsId - Список ID каналов.
   */
  onNodeChannelsUnwatch ({ channelsId }) {
    for (let channelId of channelsId) {
      const channel = Channel.channels.get(channelId)
      if (!channel) {
        console.error(`Канал "${channelId}" не найден.`)
        continue
      }
      channel.off('change', this.serverChannelUpdate)
    }
  }
}
global.Client = Client
