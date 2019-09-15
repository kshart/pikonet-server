import '@babel/polyfill'
import './stringCapitalizePolyfill'
import Disposer from '@/net/Disposer'

global.disposer = new Disposer({})
global.disposer.run()
