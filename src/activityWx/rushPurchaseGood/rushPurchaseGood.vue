<template>
    <div class="rushPurchaseGood">
      <good-detail :data-detail = "res" v-if="res"></good-detail>
      <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
      <loading :isshowloading="isshowloading"></loading>
    </div>
</template>
<script>
import goodDetail from './components/good';
import toast from "../../components/toast"; //提示框
import loading from "../../components/loading"; //加载loading
import axios from "axios";
import url from "../../assets/js/interface/request";
import { h5Request, getUuid, Base64 } from "js/h5Request";
import _ from 'lodash'
import wx from 'weixin-js-sdk'

export default {
  components: {
    toast,
    loading,
    goodDetail
  },
  data() {
    return {
      wxKeyParams: {
        name: "nologin.weixin.share",
        data: {}
      },
      rushPurchaseParams: {
        name: "nologin.falsh.sale.detail", // 接口地址
        data: {
          activityLinkId: null
        }
      },
      wxParams: {
        appId: '',
        signature: '',
        nonceStr: '',
        timestamp: ''
      },
      uuid: '',
      res: {
        detail: {},
        timeFormat: {},
        saleMoney: ''
      },
      toast: {
        //提示框
        isshow: false,
        message: ""
      },
      isshowloading: false,
      queryKey: null
    };
  },
  created() {
    this.uuid = getUuid(32);
    localStorage.setItem("uuid", this.uuid);
    localStorage.setItem("key", document.location.search);
    if (localStorage.getItem("key").indexOf('?') > -1) {
      // console.log('key------------------')
      // console.log(localStorage.getItem("key"))
      // console.log(document.location.search.match(/activityLinkId=(\S*)&from/)[1])
      this.queryKey =
        // (localStorage.getItem("key").match(/=(\S*)/)[1])*1;
        document.location.search.indexOf('&from') > -1 ? document.location.search.match(/activityLinkId=(\S*)&from/)[1] : document.location.search.match(/activityLinkId=(\S*)/)[1];
    }
    this.wxData();
    setTimeout(()=> this.getData(), 600)
  },
  methods: {
    wxData() {
      // console.log('------------')
      // console.log(location.href.split('#')[0])
      const wxKeyParams = h5Request(
        { deviceNo: this.uuid ,
          url: location.href.match(/(\S*)html?/)[1] + 'html' + localStorage.getItem('key')+ '#/'},
          // location.href.split('#')[0] || ''},
        this.wxKeyParams.name
      );
      axios.post(url, wxKeyParams).then(response => {
        if (response.data && response.data.code === '0') {
          this.wxParams = JSON.parse(response.data.data)
        }
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.wxParams.appId || '', // 必填，公众号的唯一标识
          timestamp: this.wxParams.timestamp || '', // 必填，生成签名的时间戳
          nonceStr: this.wxParams.nonceStr || '', // 必填，生成签名的随机串
          signature: this.wxParams.signature || '',// 必填，签名
          jsApiList: ["onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","onMenuShareTimeline","onMenuShareAppMessage"]
        });
      });
    },
    getData() {
      const rushPurchaseParams = h5Request(
        {
          activityLinkId:  document.location.search.indexOf('&from') > -1 ? document.location.search.match(/activityLinkId=(\S*)&from/)[1] : document.location.search.match(/activityLinkId=(\S*)/)[1]
        },
        this.rushPurchaseParams.name
      );
      this.isshowloading = true;
      axios.post(url, rushPurchaseParams)
      .then(response => {
        if (response.status === 200) {
          this.isshowloading = false;
          localStorage.clear();
          localStorage.setItem("key", document.location.search.indexOf('&from') > -1 ? document.location.search.match(/(\S*)&from/)[1] : document.location.search );
          localStorage.setItem("wxContent", response.data.data.shareContent || '');
          localStorage.setItem("wxTitle", response.data.data.shareTile || '');
          localStorage.setItem("wxImg", response.data.data.flashSaleDetail.image);
          if (response.data.data && response.data.data.flashSaleDetail) {
            if (response.data.data.flashSaleDetail.slideshows) {
              let slideImgsArray = [];
              if (response.data.data.flashSaleDetail.slideshows.indexOf(';') > -1) {
                _.forEach(_.split(response.data.data.flashSaleDetail.slideshows, ';'), (it, key) => {
                  let item = {
                    id: key,
                    img: it
                  };
                  slideImgsArray.push(item);
                });
                response.data.data.flashSaleDetail.slideshows = slideImgsArray;
              } else {
                let oneSlide = [];
                oneSlide.push({img: response.data.data.flashSaleDetail.slideshows});
                response.data.data.flashSaleDetail.slideshows = oneSlide;
              }
            }
            if (response.data.data.flashSaleDetail.startTime) {
              function formatDate(res) {
                var month = res.getMonth() + 1;
                var date = res.getDate();
                var hour = res.getHours() > 9 ? res.getHours() : '0' + res.getHours();
                var minute = res.getMinutes() > 9 ? res.getMinutes() : '0' + res.getMinutes();
                return {
                  data: month + '月' + date + '日',
                  time: hour + ':' + minute
                }
              }
              this.res.timeFormat = formatDate(new Date(JSON.parse(response.data.data.flashSaleDetail.startTime)));
            }
            this.res.detail = response.data.data.flashSaleDetail;
            this.res.saleMoney = response.data.data.flashSaleDetail.skuSaleDetail[0].newPrice + '';
          }
          const wxHref = location.href.match(/(\S*)html?/)[1] + 'html' + localStorage.getItem('key')+'#/';
          const wxTitle = localStorage.getItem('wxTitle');
          const wxContent = localStorage.getItem('wxContent');
          const wxImg = localStorage.getItem('wxImg');

          wx.ready(function() { //通过ready接口处理成功验证
            // config信息验证成功后会执行ready方法
            wx.onMenuShareAppMessage({ // 分享给朋友 ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用
              title: wxTitle, // 分享标题
              desc: wxContent, // 分享描述
              link: wxHref, // 分享链接
              imgUrl: wxImg || 'http://h5.91iji.com/activityWxStatic/img/logo.png', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function() {
                // 用户确认分享后执行的回调函数
                // alert('成功了')
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // alert('失败')
              }
            });
            wx.onMenuShareTimeline({ //分享朋友圈
              title: wxTitle, // 分享标题
              link: wxHref,
              imgUrl: wxImg || 'http://h5.91iji.com/activityWxStatic/img/logo.png', // 分享图标
              success: function() {
                // 用户确认分享后执行的回调函数
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
              }
            });
            wx.onMenuShareQQ({ // 分享QQ ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用
              title: wxTitle, // 分享标题
              desc: wxContent, // 分享描述
              link: wxHref, // 分享链接
              imgUrl: wxImg || 'http://h5.91iji.com/activityWxStatic/img/logo.png', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function() {
                // 用户确认分享后执行的回调函数
                // alert('成功了')
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // alert('失败')
              }
            });
            wx.onMenuShareWeibo({ // 分享微博 ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用
              title: wxTitle, // 分享标题
              desc: wxContent, // 分享描述
              link: wxHref, // 分享链接
              imgUrl: wxImg || 'http://h5.91iji.com/activityWxStatic/img/logo.png', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function() {
                // 用户确认分享后执行的回调函数
                // alert('成功了')
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // alert('失败')
              }
            });
            wx.onMenuShareQZone({ // 分享QQ空间 ,在config里面填写需要使用的JS接口列表，然后这个方法才可以用
              title: wxTitle, // 分享标题
              desc: wxContent, // 分享描述
              link: wxHref, // 分享链接
              imgUrl: wxImg || 'http://h5.91iji.com/activityWxStatic/img/logo.png', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function() {
                // 用户确认分享后执行的回调函数
                // alert('成功了')
              },
              cancel: function() {
                // 用户取消分享后执行的回调函数
                // alert('失败')
              }
            });
          });
          wx.error(function(){//通过error接口处理失败验证
            console.log('失败了')
            // config信息验证失败会执行error函数
          });
        } else {
          this.isshowloading = false;
          this.showtoast(response.msg || "获取限时抢购数据失败", true);
        }
      })
      .catch(() => {
        this.isshowloading = false;
        this.showtoast("服务异常 请稍后重试", true);
        return;
      });
    },
    showtoast(data) {
      this.toast.isshow = true;
      this.toast.message = data;
    },
    closetoast() {
      this.toast.isshow = false;
    }
  }
};
</script>
