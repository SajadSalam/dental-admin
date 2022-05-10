import Vue from "vue";
import store from "@/store";
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
axiosIns.interceptors.response.use(
  function(response) {
    if (response.config.method != "get") {
      // console.log(re);

      if (response.status == 200) {
        store.commit("UPDATE_SNACKBAR_MESSAGE", {
          message: "تم الحفظ بنجاح",
          color: "success",
        });
        store.commit("UPDATE_SNACKBAR", true);
      } else {
        console.log(response);
      }
    }
    return response;
  },
  function(error) {
    store.commit("UPDATE_SNACKBAR", true);
    store.commit("UPDATE_SNACKBAR_MESSAGE", {
      message: error.response.data.error.message,
    });
    // console.log();
    store.commit("setLoading", false);
    return Promise.reject(error);
  }
);
Vue.prototype.$http = axiosIns;
export default axiosIns;
