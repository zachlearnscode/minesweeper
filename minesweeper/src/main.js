import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import AnimateCSS from 'animate.css';

Vue.use(AnimateCSS);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
