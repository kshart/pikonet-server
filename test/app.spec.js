import '@/stringCapitalizePolyfill'
import Disposer from '@/net/Disposer'
import NodeAPI from '@/externalApi/NodeAPI'
import ChannelBusAPI from '@/externalApi/ChannelBusAPI'
import SocketConnection from '@/externalApi/connections/SocketConnection'

describe('Server', () => {
  const disposer = new Disposer({})
  before(() => {
    disposer.run()
  })

  after(() => {
    disposer.stop()
  })

  describe('Socket API', () => {
    const connection = new SocketConnection({ url: '127.0.0.1:69' })
    const nodeAPI = new NodeAPI({ connection })
    const channelBusAPI = new ChannelBusAPI({ connection })
    it('delay', done => {
      setTimeout(() => {
        connection.open()
        done()
      }, 1000)
    })
    it('serverConnect', done => {
      nodeAPI.serverConnect()
        .then(({ name, nodeTypeSupport, nodesCount }) => {
          if (nodesCount != 0) {
            return done('Колличество нод на новом сервере должно дыть 0')
          }
          if (name != 'me') {
            return done('Имя сервера не соответствует заданному')
          }
          if (nodeTypeSupport.length != 0 || !(
            nodeTypeSupport.includes('StaticValueNode')
          )) {
            return done('Поддерживаемые типы нод не соответствуют заданным')
          }
          done()
        })
    })
    it('nodeCreate', done => {
      // ({ node })
      nodeAPI.nodeCreate({
        node: {
          id: 'testNodeStatic1'
        }
      }).then(() => done())
      done()
    })
    it('nodeRemove', done => {
      // ({ nodeId })
      done()
    })
    it('nodeGetList', done => {
      done()
    })
    it('nodeUpdate', done => {
      // ({ node })
      done()
    })
    it('nodeMigrate', done => {
      // ({ nodeId })
      done()
    })
    it('nodeGetChannelList', done => {
      const testNodeId = 'asfsf'
      channelBusAPI.getChannelList(testNodeId)
        .then(({ nodeId, channels }) => {
          if (testNodeId != nodeId) {
            done(`Ошибка в ответе testNodeId != nodeId, '${testNodeId}' != '${nodeId}'`)
          }
          console.log(channels)
          done()
        })
    })
    it('nodeChannelRead', done => {
      // ({ channelId })
      done()
    })
    it('nodeChannelSend', done => {
      // ({ channelId, data })
      done()
    })
    it('nodeChannelWatch', done => {
      // ({ channelId })
      done()
    })
    it('nodeChannelUnwatch', done => {
      // ({ channelId })
      done()
    })
  })
})
