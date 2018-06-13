<template>
    <div class="insurancePolicyDetail">
      <div>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-collapse">
            <a class="mui-navigate-right" href="#">面板1</a>
            <div class="mui-collapse-content">
              <p>面板1子内容</p>
            </div>
          </li>
        </ul>
        <span class="mui-badge">1</span>
        <span class="mui-badge mui-badge-primary">12</span>
        <span class="mui-badge mui-badge-success">123</span>
        <span class="mui-badge mui-badge-warning">3</span>
        <span class="mui-badge mui-badge-danger">45</span>
        <span class="mui-badge mui-badge-purple">456</span>
      </div>
      <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
      <loading :isshowloading="isshowloading"></loading>
    </div>
</template>
<script>
import toast from "../../components/toast"; //提示框
import loading from "../../components/loading"; //加载loading
// import axios from "axios";
import {get} from "js/interface/api-factory"
import { h5Request, getUuid, Base64 } from "js/h5Request";
import _ from 'lodash'
import mui from 'mui'

export default {
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
    };
  },
  created() {
    this.uuid = getUuid(32);
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
      get('inpatient/getInpatientInsDetail', {'productNo': '1000028'}).then(response => {
        console.log(response)
      })
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
