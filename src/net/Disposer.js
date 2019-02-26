/**
 * @author Артём Каширин <kshart@yandex.ru>
 * @fileoverview Module
 */
import net from 'net'
import Client from './Client'

/**
 * Класс для управления клиентами
 * @memberof module:net
 */
export default class Disposer {
  /**
   * Клиенты.
   * @type {Set<module:net.Client>}
   */
  static clients = new Set()

  static run ({ processName = 'default' }) {
    console.log(`Server start for "${processName}"`)
    const server = net.createServer(socket => {
      const client = new Client({ socket })
      this.clients.add(client)
      // TODO: Освобождение ресурсов
    }).on('error', err => {
      throw err
    })

    server.listen(
      {
        port: 69,
        host: '127.0.0.1'
      },
      () => console.log('opened server on', server.address())
    )
  }
}
