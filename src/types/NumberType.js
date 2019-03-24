import ValueType from './ValueType'

/**
 * Числовой типов данных
 * @memberof types
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class NumberType extends ValueType {
  constructor ({ value, time }) {
    super()

    /**
     * Значение.
     * @type {Number}
     */
    this.value = value

    /**
     * Время изменения значения.
     * @type {Date}
     */
    this.time = time
  }
}
