import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import { ClientTable } from "vue-tables-2";

let options = {};
let useVuex = false;
let theme = "bootstrap3";
let template = "default";

Vue.use(VueRouter);
Vue.use(ClientTable, options, useVuex, theme, template);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
