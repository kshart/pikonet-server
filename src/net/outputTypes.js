/**
 * @module net/outputTypes
 */
export default {
  /**
   * @typedef {Object} module:net/outputTypes.serverHello
   * @property {String} name имя текущего сервера
   * @property {Array<String>} nodeTypeSupport список доступных типов нод
   * @property {Number} nodesCount колличество нод у сервера
   */
  serverHello: 'serverHello',
  nodeList: 'nodeList',
  /**
   * Список каналов у ноды
   */
  nodeChannelList: 'nodeChannelList',
  nodeChannelUpdate: 'nodeChannelUpdate',
  nodeMigrate: 'nodeMigrate'
}
