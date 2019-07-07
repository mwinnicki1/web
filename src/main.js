import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from 'axios'
Vue.use(BootstrapVue);

Vue.config.productionTip = false;


const base = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 5000,
  headers: { Accept: "*/*", "Content-Type": "application/json" }
});

Vue.prototype.$api = base

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
