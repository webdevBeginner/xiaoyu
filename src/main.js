import Vue from 'vue'
import App from './App.vue'
import mview from './utils/mview'
import Vant from 'vant';
import 'vant/lib/index.css';
import VueI18n from 'vue-i18n'
import router from './router'
import Storage from 'vue-ls';
import lsConfig from '@/vue-ls.config';
import myPhone from '@/components/myPhone'
import Identify from '@/components/identify'
import Smscode from '@/components/smscode'
import Card from '@/components/Card'
import Lock from '@/components/Lock'
import Charge from '@/components/Charge'
import loading from '@/components/loading'
import update from '@/components/update'
import FingerPrint from '@/components/FingerPrint'
import QrScanner from '@/components/QrScanner'
import LanguagePackage from '../static/i18n'
import 'vant/lib/index.less'
import './style/resetVant.less'
import {
    Toast
} from 'vant';
import {
    Notify
} from 'vant'
import filters from './filter'
import store from './store'
import VueClipboard from 'vue-clipboard2'; //复制到剪切板
import {
    Lazyload
} from 'vant';

Vue.use(Lazyload);

Vue.use(VueClipboard)
const common_ = {
    install(Vue) {
        Vue.component('MyPhone', myPhone)
        Vue.component('Card', Card)
        Vue.component('Charge', Charge)
        Vue.component('Smscode', Smscode)
        Vue.component('loading', loading)
        Vue.component('update', update)
        Vue.component('Identify', Identify)
        Vue.component('Lock', Lock)
        Vue.component('FingerPrint', FingerPrint)
        Vue.component('QrScanner', QrScanner)
    }
}
Vue.use(common_)


Vue.use(VueI18n)
Vue.use(Toast);
Vue.use(Notify);
Vue.use(Vant);
Vue.use(Storage, lsConfig.storageOptions);

Vue.prototype.mview = mview
Vue.config.productionTip = false

// import animated from 'animate.css'
// Vue.use(animated)
require('vue2-animate/dist/vue2-animate.min.css')

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
Vue.locale = () => {}
const i18n = new VueI18n({
    locale: window.localStorage.getItem('language') === null ? 'zh' : window.localStorage.getItem('language'), // 语言标识
    messages: {
        'en': Object.assign(LanguagePackage.en), // 英文
        'zh': Object.assign(LanguagePackage.zh), // 英文
    }
})
new Vue({
    render: h => h(App),
    router,
    store,
    i18n
}).$mount('#app')