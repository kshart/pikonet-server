/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class ChannelBusAPI {
  constructor ({ connection }) {
    /**
     * Уникальный ключ канала
     * @type {String}
     */
    this.connection = connection

    this.registredChannels = new Map()
    this.channelsData = new Map()
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

  getChannelList (nodeId) {
    return this.connection.send('nodeGetChannelList', { nodeId }, { waitResult: true })
  }

  channelRead (channelId) {
  }

  /**
   * Отправить данные в канал.
   * @param {String} channelId - ID канала.
   * @param {any} data - Данные которые необходимо записать в канал.
   */
  channelSend (channelId, data) {
    console.log(channelId, data)
  }

  /**
   * Зарегистрировать просмотрщик канала.
   * @param {String} channelId - ID канала.
   * @param {any} component - Компонент для которого регистрируется слушатель канала.
   */
  channelWatch (channelId, component = null) {
    console.log(channelId, component)
  }

  /**
   * Удалить просмотрщик канала.
   * @param {String} channelId - ID канала.
   * @param {any} component - Компонент для которого был зарегистрирован слушатель канала.
   */
  channelUnwatch (channelId, component = null) {
    console.log(channelId, component)
  }
}
