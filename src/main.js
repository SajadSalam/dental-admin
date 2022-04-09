import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./libs/http/http";
import config from "./config";
import vueDebounce from "vue-debounce";
import VueMask from "v-mask";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import enUS from '@kangc/v-md-editor/lib/lang/en-US';

VueMarkdownEditor.lang.use('en-US', enUS);
// Prism
import Prism from "prismjs";
// highlight code
import "prismjs/components/prism-json";

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

Vue.use(VueMarkdownEditor);
Vue.use(VueMask);
import { VueMaskDirective } from "v-mask";
Vue.directive("mask", VueMaskDirective);
Vue.use(vueDebounce);
Vue.prototype.$config = config;
Vue.config.productionTip = false;
import service from "../utils";
Vue.prototype.$service = service;
import rules from "./validations";
Vue.prototype.$rules = rules;
// if (localStorage.getItem("theme") == null) {
//   localStorage.setItem(
//     "theme",
//     JSON.stringify({
//       colors: {
//         primary: "#FC766A", // orange
//         secondary: "#5B84B1", // grey
//         accent: "#3CC2E0", // cyan
//         error: "#FF606B",// red,
//         info: "#2196F3",
//         success: "#2ED67B",// gren
//         warning: "#FFC107",
//         darkBackground: "#1E1E1E",
//         lightBackground: "#F5F5F5"
//       },
//       backType: '',
//       image: null,
//       appbar: "light",
//       drawer: "light"
//     })
//   );
//   window.location.reload();
// } else {
//   const theme = JSON.parse(localStorage.getItem("theme"));
//   if (theme.colors == undefined || theme.backType == undefined || theme.appbar == undefined || theme.drawer == undefined) {

//     localStorage.setItem(
//       "theme",
//       JSON.stringify({
//         colors: {
//           primary: "#FC766A", // orange
//           secondary: "#5B84B1", // grey
//           accent: "#3CC2E0", // cyan
//           error: "#FF606B",// red,
//           info: "#2196F3",
//           success: "#2ED67B",// gren
//           warning: "#FFC107",
//           darkBackground: "#1E1E1E",
//           lightBackground: "#F5F5F5"
//         },
//         backType: 'gradient',
//         image: null,
//         appbar: "light",
//         drawer: "dark"
//       })
//     );
//     window.location.reload();
//   }
// }
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
