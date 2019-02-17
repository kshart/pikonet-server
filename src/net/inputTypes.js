export default {
  /**
   * Входящее соединие от сервера
   */
  serverConnect: 'serverConnect',

  /**
   * Список нод у текущего пула
   */
  nodeGetList: 'nodeGetList',

  /**
   * Добавить ноду в пул
   */
  nodeCreate: 'nodeCreate',

  /**
   * Обновить конфигурацию ноды в пуле
   */
  nodeUpdate: 'nodeUpdate',

  /**
   * Запросить миграцию ноды с текущего сервера
   */
  nodeMigrate: 'nodeMigrate',

  /**
   * Удалить ноду из пула
   */
  nodeRemove: 'nodeRemove',

  /**
   * Список каналов у ноды
   */
  nodeGetChannelList: 'nodeGetChannelList',

  /**
   * Прочитать канал у ноды
   */
  nodeChannelRead: 'nodeChannelRead',

  /**
   * Записать в канал у ноды
   */
  nodeChannelSend: 'nodeChannelSend',

  /**
   * Зарегистрировать просмотрщик канала у ноды
   */
  nodeChannelWatch: 'nodeChannelWatch',

  /**
   * Удалить просмотрщик канала у ноды
   */
  nodeChannelUnwatch: 'nodeChannelUnwatch'
}
