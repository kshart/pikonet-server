import NodeComponent from '@/core/NodeComponent'

/**
 * Тип ноды для умножения чисел.
 * @memberof nodes
 * @augments core.NodeComponent
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class MultiplicationNode extends NodeComponent {
  constructor (nodeConfig) {
    super(nodeConfig)
    this.createChannel({ name: 'valueIn1', data: nodeConfig.valueIn1, writable: true })
    this.createChannel({ name: 'valueIn2', data: nodeConfig.valueIn2, writable: true })
    this.createChannel({ name: 'valueOut', data: nodeConfig.valueIn1 * nodeConfig.valueIn2 })
  }

  /**
   * @inheritdoc
   */
  update () {
    console.log('update')
  }
}
