import EventEmitter from 'events'

/**
 * @memberof net.connections
 * @requires external:EventEmitter
 * @augments external:EventEmitter
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Connection extends EventEmitter {
  /**
   * Отправить пакет
   * @param {Object} data пакет
   */
  send (data) {
  }
}
