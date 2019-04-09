import EventEmitter from 'events'

/**
 * @memberof net.connections
 * @requires external:EventEmitter
 * @augments external:EventEmitter
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Connection extends EventEmitter {
  constructor (config) {
    super(config)
    this.on('error', err => console.log(err))
  }

  /**
   * Отправить пакет
   * @param {Object} data пакет
   */
  send (data) {
  }
}
