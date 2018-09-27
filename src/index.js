
import Server from './net/Server'
import nodeConfig from './core/nodeConfig'

const options = {}
Server.run(options)

nodeConfig.forEach(conf => {
  const node = global.nodeManager.createNode(conf)
  // const channel = node.channels.get('value')
  // let value = 0
  // setInterval(() => {
  //   channel.set(++value)
  // }, 1000)
})
