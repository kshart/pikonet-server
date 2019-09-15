import Connection from './Connection'

/**
 * Класс предназначен для общения по сокету с клиентами.
 * @requires net.connections.Connection
 * @memberof net.connections
 * @augments net.connections.Connection
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class WebSocketConnection extends Connection {
  constructor ({ wSocket }) {
    super()

    /**
     * @type {external:"websocket"}
     */
    this.wSocket = wSocket

    wSocket.on('message', message => {
      if (message.type !== 'utf8') {
        console.error('Сообщение не utf8')
        return
      }
      try {
        const data = JSON.parse(message.utf8Data)
        this.emit('message', data)
      } catch (error) {
        console.log(message.utf8Data)
        console.error(error)
      }
    })
    wSocket.on('close', () => this.emit('close'))
  }

  /**
   * Имя соединения.
   * @return {String} Имя соединения.
   */
  getName () {
    return this.wSocket.remoteAddress
  }

  /**
   * Отправить пакет
   * @param {Object} data - Пакет.
   */
  send (data) {
    this.wSocket.send(
      JSON.stringify(data)
    )
  }
}
