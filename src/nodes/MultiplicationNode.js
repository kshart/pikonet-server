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
    this.updateOutData = () => {
      this.valueOut.set(this.valueIn1.data * this.valueIn2.data)
    }
    this.valueIn1 = this.createChannel({ name: 'valueIn1', data: nodeConfig.valueIn1, writable: true })
    this.valueIn2 = this.createChannel({ name: 'valueIn2', data: nodeConfig.valueIn2, writable: true })
    this.valueOut = this.createChannel({ name: 'valueOut', data: nodeConfig.valueIn1 * nodeConfig.valueIn2 })
    this.valueIn1.on('change', this.updateOutData)
    this.valueIn2.on('change', this.updateOutData)
  }

  destructor () {
    this.valueIn1.off('change', this.updateOutData)
    this.valueIn2.off('change', this.updateOutData)
  }

  /**
   * @inheritdoc
   */
  update () {
    console.log('update')
  }
}
