import '@babel/polyfill'
import './stringCapitalizePolyfill'
import Disposer from '@/net/Disposer'

const disposer = new Disposer({})
disposer.run()
