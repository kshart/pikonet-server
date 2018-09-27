import Node from '../core/Node'

export default class extends Node {
  constructor (config) {
    super(config)
    this.createChannel({ name: 'value', data: config.value, writable: true })
  }
}
