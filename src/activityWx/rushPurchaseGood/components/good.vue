<template>
    <div class="goods" v-if="dataDetail.detail">
      <div class="banner">
        <wc-swiper class="swiper" v-if="dataDetail.detail.slideshows">
          <wc-slide v-for="(item, index) in dataDetail.detail.slideshows" :key="index">
            <img :src="item.img" :alt="index">
          </wc-slide>
        </wc-swiper>
      </div>
      <div class="good-content">
        <div class="priceItem">
          <div class="price-left">
            <strong><code>¥</code>{{dataDetail.saleMoney / 100 | moneyFormat}}</strong>
            <p>原价&nbsp;¥{{dataDetail.detail.skuLowSales / 100 | moneyFormat}}</p>
          </div>
          <div class="price-right" v-if="dataDetail.timeFormat">
            <p class="dataStart">预计{{dataDetail.timeFormat.data}}</p>
            <p class="timeStart">{{dataDetail.timeFormat.time}}&nbsp;开抢</p>
          </div>
        </div>
        <div class="nameItem">
          <div>
            <code>尖货秒杀</code>
            <span>{{dataDetail.detail.activityName}}</span>
          </div>
        </div>
        <div v-if="dataDetail.detail.graphicDetails">
          <div v-html="dataDetail.detail.graphicDetails"></div>
        </div>
      </div>
      <div class="btn" @click="submitAction">
        立刻拥有
      </div>
      <!--toasts提示组件-->
      <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
      <loading :isshowloading="isshowloading"></loading>
    </div>
</template>
<script>
import browser from "src/assets/js/browser";
import toast from "../../../components/toast"; //提示框
import loading from "../../../components/loading"; //加载loading
import {moneyFormat} from "src/assets/js/filter";

export default {
  props: {
    dataDetail: {
      type: [Object],
      default: {}
    }
  },
  components: {
    toast,
    loading
  },
  data() {
    return {
      toast: {
        //提示框
        isshow: false,
        message: ""
      },
      isshowloading: false,
      // timeTemplate: [],
      // showTime: false
    };
  },
  created() {
    // const time = localStorage.getItem('startTime')
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     function formatDate(res) {
    //       var month = res.getMonth() + 1;
    //       var date = res.getDate();
    //       var hour = res.getHours() > 9 ? res.getHours() : '0' + res.getHours();
    //       var minute = res.getMinutes() > 9 ? res.getMinutes() : '0' + res.getMinutes();
    //       return [
    //         month + '月' + date + '日'
    //         , hour + ':' + minute
    //       ];
    //     }
    //     this.timeTemplate = formatDate(new Date(JSON.parse(time)));
    //     if (this.timeTemplate) {
    //       setTimeout(() => {
    //         this.showTime = true;
    //       }, 600)
    //     }
    //   });
    // }, 600);
  },
  methods: {
    showtoast(data) {
      this.toast.isshow = true;
      this.toast.message = data;
    },
    closetoast() {
      this.toast.isshow = false;
    },
    submitAction() {
      setTimeout(() => {
        this.showtoast('正在跳转到对应下载链接，请稍等', true);
        if (browser.versions.ios) {
          this.toast.isshow = false;
          window.location.href = "https://itunes.apple.com/cn/app/id1372010318?mt=8"
        } else if (browser.versions.android) {
          this.toast.isshow = false;
          window.location.href = "http://p6e8yws4d.bkt.clouddn.com/app-release_legu_t666666_signed_zipalign.apk"
        }
      }, 600);
    }
  },
  filters: {
    moneyFormat(value) {
      return moneyFormat(value);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

