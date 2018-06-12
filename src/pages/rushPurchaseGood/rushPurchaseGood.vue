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
import mui from 'mui'

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
    this.getData();
  },
  mounted() {
    mui.plusReady(function(){
      mui.init({
      });
    });
  },
  methods: {
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
