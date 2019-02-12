import nodeManager from '@/core/NodeManager'

export default nodeManager.extend({
  init ({ value }) {
    console.log('init')
    this.createChannel({ name: 'value', data: value, writable: true })
  },
  stateToConfig () {
    return {
      ...this.channelsToConfig()
    }
  },
  beforeMigrate () {
    console.log('beforeMigrate')
    return true
  },

  beforeRemove () {
    console.log('beforeRemove')
  },

  update () {
    console.log('update')
  },

  remove () {
    console.log('remove')
  },

  start () {
    console.log('start')
  },

  stop () {
    console.log('stop')
  }
})
