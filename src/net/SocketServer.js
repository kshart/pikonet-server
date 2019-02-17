import net from 'net'
import SocketClient from './SocketClient'

export default class SocketServer {
  static run ({ processName = 'default' }) {
    console.log(`Server start for "${processName}"`)
    const server = net.createServer(socket => {
      const socketClient = new SocketClient({ socket })
      console.log('client connected')
      socket.setEncoding('utf8')

      socket.on('connect', () => console.log('connect'))
      socket.on('data', async data => {
        try {
          const request = JSON.parse(data)
          socketClient.handleRequest(request)
        } catch (error) {
          console.error(error, data)
          socket.write('error')
        }
      })
      socket.on('drain', () => console.log('drain'))
      socket.on('end', () => socketClient.destroy())
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
