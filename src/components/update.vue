<template>
  <div v-if="UPDATE">
    <div class="update">
      <div class="close" @click="closeUpdate"></div>
      <p class="title">{{$t('发现新版本')}}</p>
      <p class="ver">{{$t('新版本')}}v{{version}}</p>
      <p class="last">{{$t('【修复】修复上一版的BUG')}}</p>
      <van-button class="updateBtn" type="info" @click="doCopy" color="#000">{{$t('立即更新')}}</van-button>
    </div>
    <div class="muban"></div>
  </div>
</template>
 
<script>
import { mapState } from "vuex";
export default {
  name: "UPDATE",
  data() {
    return {
      version: ""
    };
  },
  created() {
    this.version = localStorage.getItem("version");
  },
  methods: {
    closeUpdate() {
      this.$store.commit("showUpdate", false);
    },
    doCopy() {
      this.$copyText("https://siki.vip/fNLi").then(
        e => {
          // success
          this.$toast({
            /*这是使用了element-UI的信息弹框*/
            message: this.$t("下载链接复制成功，请在浏览器中打开下载！")
          });
        },
        e => {
          // fail
          this.$toast({
            message: this.$t("复制失败，请手动选择复制！")
          });
        }
      );
    }
  },
  computed: {
    ...mapState(["UPDATE"])
  }
};
</script>
<style lang="less" scoped>
@import "../style/mixin.less";
.update {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -2.49rem;
  margin-top: -3.91rem;
  width: 4.98rem;
  height: 7.82rem;
  .bg-image("../../static/img/update");
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 100;
  .close {
    width: 0.52rem;
    height: 0.52rem;
    .bg-image("../../static/img/close");
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    right: -0.26rem;
    top: 1.55rem;
  }
  p {
    margin: 0;
  }
  .title {
    font-size: 0.5rem;
    font-weight: 700;
    margin-top: 4rem;
  }
  .ver {
    font-size: 0.24rem;
    line-height: 0.6rem;
    color: #ff9467;
  }
  .last {
    font-size: 0.3rem;
    color: #0c122c;
    line-height: 0.6rem;
  }
  /deep/.van-button {
    margin-top: 0.4rem;
    width: 4rem;
  }
}
.muban {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
</style>