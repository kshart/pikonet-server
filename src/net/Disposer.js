import net from 'net'
import http from 'http'
import { server as WebSocketServer } from 'websocket'
import Client from './Client'
import SocketConnection from './connections/SocketConnection'
import WebSocketConnection from './connections/WebSocketConnection'

/**
 * Класс для управления клиентами
 * @requires core.Client
 * @memberof net
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Disposer {
  constructor ({ processName = 'default' }) {
    this.processName = processName

    this.socketServer = net.createServer(socket => {
      const connection = new SocketConnection({ socket })
      const client = new Client({ connection })
    }).on('error', err => {
      throw err
    })

    this.httpServer = http.createServer((request, response) => {})

    this.wsServer = new WebSocketServer({ httpServer: this.httpServer })
      .on('request', request => {
        const wSocket = request.accept(null, request.origin)
        const connection = new WebSocketConnection({ wSocket })
        const client = new Client({ connection })
      })
  }

  /**
   * Запустить сервер.
   */
  run () {
    this.socketServer.listen(
      {
        port: 69,
        host: '127.0.0.1'
      },
      () => console.log(`Socket сервер запущен.`, this.socketServer.address())
    )
    this.httpServer.listen(
      {
        port: 169,
        host: '127.0.0.1'
      },
      () => console.log(`WebSocket сервер запущен.`, this.httpServer.address())
    )
  }

  /**
   * Остановить сервер.
   */
  stop () {
    this.wsServer.shutDown()
    this.httpServer.close()
    this.socketServer.close()
  }
}
