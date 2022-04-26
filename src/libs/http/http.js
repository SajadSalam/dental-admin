import Vue from "vue";
import axios from "axios";
const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: "http://158.247.235.172:1337/api",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    Authorization:
      localStorage.getItem("accessToken") !== null
        ? `Bearer ${localStorage.getItem("accessToken")}`
        : "",
    "Content-Type": "application/json",
  },
});
Vue.prototype.$http = axiosIns;
export default axiosIns;
