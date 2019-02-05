
import nodeConfig from '@/core/nodeConfig'
import nodeManager from '@/core/NodeManager'
import SocketServer from '@/net/SocketServer'

const options = {}
SocketServer.run(options)

nodeConfig.forEach(conf => {
  const node = nodeManager.createNode(conf)
  // const channel = node.channels.get('value')
  // let value = 0
  // setInterval(() => {
  //   channel.set(++value)
  // }, 1000)
})
