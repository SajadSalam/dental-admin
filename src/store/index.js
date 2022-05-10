import Vue from "vue";
import Vuex from "vuex";
import config from "../config";
import style from "./style";
import regions from "./regions";
import http from "../libs/http/http";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isRTL: config.isRTL,
    dark: localStorage.getItem("dark") == "true" ? true : false,
    drawer: true,
    loading: false,
    userData:
      localStorage.getItem("userData") !== null
        ? JSON.parse(localStorage.getItem("userData"))
        : null,
    accessToken:
      localStorage.getItem("accessToken") !== null
        ? localStorage.getItem("accessToken")
        : null,
    passwordDialog: false,
    user: null,
    snackbar: false,
    snackbarMessage: "",
    snackbarColor: "",
  },
  mutations: {
    UPDATE_SNACKBAR(state, val) {
      state.snackbar = val;
    },

    UPDATE_SNACKBAR_MESSAGE(state, { message, color = "error" }) {
      state.snackbarMessage = message;
      state.snackbarColor = color;

      if (message != "") {
        state.snackbar = true;
      }
    },
    UPDATE_RTL(state, val) {
      state.isRTL = val;
    },
    UPDATE_DARK(state, val) {
      localStorage.setItem("dark", val);
      state.dark = val;
    },
    TOGGLE_DRAWER(state) {
      state.drawer = !state.drawer;
    },
    setLoading(state, val) {
      state.loading = val;
    },
    togglePasswordDialog(state) {
      state.passwordDialog = !state.passwordDialog;
    },
    setUser(state, val) {
      state.user = val;
    },
    setUserData(state, val) {
      state.userData = val;
      if (val == null) {
        localStorage.clear();
        state.accessToken = null;
      } else {
        state.accessToken = val.jwt;
        localStorage.setItem("accessToken", val.jwt);
        localStorage.setItem("userData", JSON.stringify(val));
      }
    },
  },
  actions: {
    uploadFile({ state }, file) {
      state.loading = true;
      return new Promise((resolve, reject) => {
        if (file != null && typeof file != "string" && file.size > 1) {
          var form = new FormData();
          form.append("files", file);
          http
            .post("/UploadFile/postUploadFiles", form)
            .then((res) => {
              resolve(res.data.fileList[0].path);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve(file);
        }
      });
    },
  },
  modules: {
    style,
    regions,
  },
});
