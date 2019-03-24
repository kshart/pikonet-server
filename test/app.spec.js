import Disposer from '@/net/Disposer'

describe('Server', () => {
  const disposer = new Disposer({})
  before(() => {
    disposer.run()
  })

  after(() => {
    disposer.stop()
  })

  describe('Socket API', () => {
    it('error', done => {
      done('hello')
    })
    it('serverConnect', done => {
      done()
    })
    it('nodeGetList', done => {
      done()
    })
    it('nodeCreate', done => {
      // ({ node })
      done()
    })
    it('nodeUpdate', done => {
      // ({ node })
      done()
    })
    it('nodeRemove', done => {
      // ({ nodeId })
      done()
    })
    it('nodeMigrate', done => {
      // ({ nodeId })
      done()
    })
    it('nodeGetChannelList', done => {
      // ({ nodeId }, { id })
      done()
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
