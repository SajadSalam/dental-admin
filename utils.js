const numeral = require("numeral");
const moment = require("moment");
import store from "@/store";
export const formatNumber = (x) => {
  return numeral(x).format("0,0[.]0");
};
export const url = "http://158.247.235.172:1337";
export const formatDate = (date, showTime = true) => {
  showTime;
  var formate = "YYYY/MM/DD";
  if (showTime) {
    formate = "YYYY/MM/DD hh:mmA";
  }
  var ret = moment(date).format(formate);
  return ret;
};
export const hideFrom = (roles) => {
  var role = store.state.roles[store.getters.role];
  var permissions = roles(role);
  return permissions.indexOf(false) > -1;
};
export const float = (x) => {
  return typeof x == "string" ? parseFloat(x.replace(",", "")) : x;
};
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    formData.append("files", file);
    fetch("http://158.247.235.172:1337/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export default {
  formatNumber,
  formatDate,
  hideFrom,
  url,
  float,
  uploadFile,
};
