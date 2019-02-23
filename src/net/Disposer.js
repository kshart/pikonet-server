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
class Disposer {
  static run ({ processName = 'default' }) {
    console.log(`Server start for "${processName}"`)
    const server = net.createServer(socket => {
      const client = new Client({ socket })
      console.log('client connected')
      socket.setEncoding('utf8')

      socket.on('connect', () => console.log('connect'))
      socket.on('data', data => {
        try {
          const request = JSON.parse(data)
          client.handleRequest(request)
        } catch (error) {
          console.error(error, data)
          socket.write('error')
        }
      })
      socket.on('drain', () => console.log('drain'))
      socket.on('end', () => client.destroy())
      socket.on('error', error => console.log(error))
      socket.on('lookup', (err, address, family, host) => console.log('lookup', err, address, family, host))
      socket.on('timeout', () => console.log('timeout'))
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

export default Disposer
