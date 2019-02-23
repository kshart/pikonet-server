import '@babel/polyfill'
import Disposer from '@/net/Disposer'

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
Disposer.run({})
