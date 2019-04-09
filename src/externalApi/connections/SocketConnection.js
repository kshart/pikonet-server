import { Socket } from 'net'
import Connection from './Connection'

const Stages = {
  BEFORE_CONNECT: 'BEFORE_CONNECT',
  WAIT_INFO: 'WAIT_INFO'
}

export default class SocketConnection extends Connection {
  static delimiter = '\n'

  constructor ({ url = '127.0.0.1:69' }) {
    super()

    /**
     * Путь к API.
     * @type {!String}
     */
    this.url = url

    /**
     * @type {Map<String, Set<Function>>}
     */
    this.requestWaitResponce = new Map()

    this.lastResposeId = 0

    /**
     * Сырые данные из сокета
     * @type {String}
     */
    this._rawDataFromSocket = null

    /**
     * Сокет.
     * @type {WebSocket} socket
     * @private
     */
    this.socket = new Socket()
      .setEncoding('utf8')
      .on('ready', () => {
        this.emit('open')
      })
      .on('data', chunk => {
        const buffer = this._rawDataFromSocket !== null ? this._rawDataFromSocket + chunk : chunk
        const requests = buffer.split(SocketConnection.delimiter)
        if (requests.length === 1) {
          this._rawDataFromSocket = requests[0]
        } else if (requests.length > 1) {
          for (let i = 0; i < requests.length - 1; ++i) {
            try {
              this.handleRequest(requests[i])
            } catch (error) {
              console.error(error, requests[i])
            }
          }
          if (requests[requests.length - 1] !== '') {
            this._rawDataFromSocket = requests[requests.length - 1]
          }
        }
      })
      .on('error', err => console.log(`Ошибка соединения с сервером ${url}`, err))
      .on('close', () => {
        this.emit('close')
        this.destructor()
      })
  }

  open () {
    console.log('Попытка подключения')
    this.emit('tryConnect')
    this.socket.connect(69, '127.0.0.1')
  }

  destructor () {
    this.emit('close', this)
    if (this.socket) {
      this.socket.end()
    }
  }

  get connected () {
    return true
  }

  /**
   * Отправить пакет
   * @param {String} method - Тип пакета.
   * @param {Object} params - "полезная нагрузка", зависит от типа пакета.
   * @param {Object} config - Параметры запроса.
   * @param {Boolean} config.waitResult - Необходимость ожидать ответ на запрос.
   * @access package
   */
  send (method, params = null, config) {
    if (!this.connected) {
      console.warn('API: Соединение отсутствует')
      return false
    }
    const id = ++this.lastResposeId
    if (config && config.waitResult) {
      let callbacks
      if (this.requestWaitResponce.has(id)) {
        callbacks = this.requestWaitResponce.get(id)
      } else {
        callbacks = new Set()
        this.requestWaitResponce.set(id, callbacks)
      }
      const result = new Promise((resolve, reject) => {
        callbacks.add({
          resolve,
          reject
        })
      })
      this.socket.write(
        JSON.stringify({
          id,
          method,
          params
        }) + SocketConnection.delimiter
      )
      return result
    } else {
      this.socket.write(
        JSON.stringify({
          id,
          method,
          params
        }) + SocketConnection.delimiter
      )
    }
  }

  /**
   * Обработать запрос
   * @param {String} request Запрос.
   */
  handleRequest (request) {
    const { id, requestId, method, params } = JSON.parse(request)
    this.emit(method, { id, params, requestId })
    if (this.requestWaitResponce.has(requestId)) {
      const callbacks = this.requestWaitResponce.get(requestId)
      for (let { resolve, reject } of callbacks) {
        if (method === 'error') {
          reject(params)
        } else {
          resolve(params)
        }
      }
      this.requestWaitResponce.delete(requestId)
    }
  }
}
