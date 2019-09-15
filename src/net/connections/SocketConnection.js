import Connection from './Connection'

/**
 * Класс предназначен для общения по сокету с клиентами.
 * @requires net.connections.Connection
 * @memberof net.connections
 * @augments net.connections.Connection
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class SocketConnection extends Connection {
  /**
   * Разделитель для пакетов.
   * @member {String} delimiter
   * @memberof net.connections.SocketConnection
   * @static
   */
  static delimiter = '\n'

  constructor ({ socket }) {
    super()

    /**
     * Сокет соединения.
     * @type {external:"net.Socket"}
     */
    this.socket = socket

    /**
     * Сырые данные из сокета
     * @type {String}
     */
    this._rawDataFromSocket = null

    console.log('socket create ' + socket.address())
    socket.setEncoding('utf8')
      .on('connect', () => this.emit('connect'))
      .on('data', chunk => {
        const buffer = this._rawDataFromSocket !== null ? this._rawDataFromSocket + chunk : chunk
        const requests = buffer.split(SocketConnection.delimiter)
        if (requests.length === 1) {
          this._rawDataFromSocket = requests[0]
        } else if (requests.length > 1) {
          for (let i = 0; i < requests.length - 1; ++i) {
            try {
              const data = JSON.parse(requests[i])
              this.emit('message', data)
            } catch (error) {
              console.error(error, requests[i])
            }
          }
          if (requests[requests.length - 1] !== '') {
            this._rawDataFromSocket = requests[requests.length - 1]
          }
        }
      })
      .on('drain', () => console.log('drain'))
      .on('end', () => this.emit('close'))
      .on('error', error => this.emit('error', error))
      .on('lookup', (err, address, family, host) => console.log('lookup', err, address, family, host))
      .on('timeout', () => console.log('timeout'))
  }

  /**
   * Имя соединения.
   * @return {String} Имя соединения.
   */
  getName () {
    return `${this.socket.remoteAddress}:${this.socket.remotePort}`
  }

  /**
   * Отправить пакет
   * @param {Object} data - Пакет.
   */
  send (data) {
    console.log(SocketConnection.delimiter)
    this.socket.write(
      JSON.stringify(data) + SocketConnection.delimiter
    )
  }
}
