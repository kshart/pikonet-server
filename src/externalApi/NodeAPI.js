/**
 * API для работы с нодами.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class NodeAPI {
  constructor ({ connection }) {
    /**
     * Соединение.
     * @type {externalApi.connections.Connection}
     */
    this.connection = connection
  }

  get connected () {
    return this.connection.connected
  }

  on () {
    this.connection.addEventListener.apply(this.connection, arguments)
  }

  off () {
    this.connection.removeEventListener.apply(this.connection, arguments)
  }

  serverConnect () {
    return this.connection.send('serverConnect', null, { waitResult: true })
  }

  nodeGetList () {
    return this.connection.send('nodeGetList', null, { waitResult: true })
  }

  nodeCreate (node) {
    return this.connection.send('nodeCreate', { node }, { waitResult: true })
  }

  nodeUpdate (node) {
    return this.connection.send('nodeUpdate', { node }, { waitResult: true })
  }

  nodeRemove (nodeId) {
    return this.connection.send('nodeRemove', { nodeId }, { waitResult: true })
  }

  nodeMigrate (nodeId) {
    return this.connection.send('nodeMigrate', { nodeId }, { waitResult: true })
  }

  nodeGetChannelList (nodeId) {
    return this.connection.send('nodeGetChannelList', { nodeId }, { waitResult: true })
  }
}
