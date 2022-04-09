const numeral = require('numeral');
const moment = require('moment');
import store from '@/store';
export const formatNumber = (x) => {
      return numeral(x).format("0,0[.]0")
}
export const url = "http://158.247.235.172:1338"
export const formatDate = (date, showTime = true) => {
  showTime;
  var formate = 'YYYY/MM/DD';
  if (showTime) {
    formate = 'YYYY/MM/DD hh:mmA';
  }
  var ret = moment(date).format(formate);
  return ret;
};
export const hideFrom = (roles) => {
  var role = store.state.roles[store.getters.role];
  var permissions = roles(role)
  return permissions.indexOf(false) > -1;
}
export const float = (x) => {
  return typeof x == 'string' ? parseFloat(x.replace(',','')) : x;
}
export default {
  formatNumber,
  formatDate,
  hideFrom,
  url,
  float
}