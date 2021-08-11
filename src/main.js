import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Empty } from 'vant';
import { Lazyload } from 'vant';

Vue.use(Lazyload);
Vue.use(Empty);
Vue.use(Dialog);
Vue.use(Toast);

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
