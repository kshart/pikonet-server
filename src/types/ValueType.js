/**
 * Шаблон для типов данных
 * @memberof types
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class ValueType {
  /**
   * Сравнивает данные с текущим экземпляром.
   * @param {types.ValueType} value - Данные для сравнения.
   * @return {Boolean} Результат сравнения.
   */
  equal (value) {
    return false
  }
}
