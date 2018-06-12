import Vue from 'vue'
import VueRouter from 'vue-router';
import axios from 'axios'
import wcSwiper from 'wc-swiper'
// import WechatPlugin from 'vux'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);
Vue.use(VueRouter);
// Vue.use(WechatPlugin);
// import wx from 'wx';
// 导入全局css,scss路径在webpack.base.confi.js配置了别名
module.exports = {
    Vue,
  axios,
  VueRouter,
  // WechatPlugin
}
