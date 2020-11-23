import Vue from 'vue'
import App from './App.vue'
import rawDisplayer from "./components/infra/raw-displayer.vue";
import ElementUI from "element-ui";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import 'element-ui/lib/theme-chalk/index.css';

require("bootstrap");

Vue.config.productionTip = false
Vue.component("rawDisplayer", rawDisplayer);
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

new Vue({
  render: h => h(App),
}).$mount('#app')
