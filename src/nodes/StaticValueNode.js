import NodeComponent from '@/core/NodeComponent'

/**
 * Тип ноды для статичного числа.
 * @memberof nodes
 * @augments core.NodeComponent
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class StaticValueNode extends NodeComponent {
  constructor (nodeConfig) {
    super(nodeConfig)
    this.createChannel({ name: 'value', data: nodeConfig.value, writable: true })
  }

  /**
   * @inheritdoc
   */
  stateToConfig () {
    return {
      ...this.channelsToConfig()
    }
  }

  /**
   * @inheritdoc
   */
  beforeMigrate () {
    console.log('StaticValueNode beforeMigrate')
    return true
  }

  /**
   * @inheritdoc
   */
  beforeRemove () {
    console.log('StaticValueNode beforeRemove')
  }

  /**
   * @inheritdoc
   */
  update ({ value }) {
    const channel = this.channels.get('value')
    if (!channel) {
      console.error('StaticValueNode: Ошибка записи в канал.')
      return
    }
    channel.set(value)
  }

  /**
   * @inheritdoc
   */
  destructor () {
    console.log('StaticValueNode destructor')
  }
}
