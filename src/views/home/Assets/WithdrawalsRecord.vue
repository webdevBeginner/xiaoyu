<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('提现记录')" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <!-- 记录部分 -->
    <div class="history" v-if="hisList.length">
      <Card :List="hisList"></Card>
    </div>
    <div class="noData" v-if="!hisList.length && !LOADING">
      <div class="img"></div>
      <p>{{$t('暂无数据')}}</p>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      hisList: []
    };
  },
  filters: {
    formate(time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd");
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "ACCOUNT_WITHDRAW_VIEW",
          page: 1,
          count: 10
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.hisList = data.Data.lists;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .van-icon {
    font-size: 0.45rem;
  }
  .history {
    flex: 1;
    overflow: auto;
    padding: 0.38rem;
  }
  .noData {
    margin: 0 auto;
    .img {
      width: 2.3rem;
      height: 1.9rem;
      margin: 0.88rem auto 0.3rem;
      .bg-image("../../../../static/img/zanwushuju");
      background-repeat: no-repeat;
      background-size: contain;
    }
    p {
      color: #4f5260;
      font-size: 0.4rem;
      margin: 0;
    }
  }
}
</style>