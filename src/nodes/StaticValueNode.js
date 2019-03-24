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
    console.log('beforeMigrate')
    return true
  }

  /**
   * @inheritdoc
   */
  beforeRemove () {
    console.log('beforeRemove')
  }

  /**
   * @inheritdoc
   */
  update () {
    console.log('update')
  }

  /**
   * @inheritdoc
   */
  remove () {
    console.log('remove')
  }

  /**
   * @inheritdoc
   */
  start () {
    console.log('start')
  }

  /**
   * @inheritdoc
   */
  stop () {
    console.log('stop')
  }
}
