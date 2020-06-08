<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('账单明细')" left-arrow @click-left="onClickLeft" />
    <div class="mine-content">
      <van-tabs v-model="active" animated>
        <van-tab :title="$t('收入')">
          <div v-if="lists.length && !LOADING" class="list">
            <Card :List="lists"></Card>
          </div>
          <div class="noData" v-if="!lists.length && !LOADING">
            <div class="img"></div>
            <p>{{$t('暂无数据')}}</p>
          </div>
        </van-tab>
        <van-tab :title="$t('支出')">
          <div v-if="lists.length && !LOADING" class="list">
            <Card :List="lists"></Card>
          </div>
          <div class="noData" v-if="!lists.length && !LOADING">
            <div class="img"></div>
            <p>{{$t('暂无数据')}}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      active: 0,
      lists: []
    };
  },
  computed: {
    ...mapState(["LOADING"])
  },
  created() {
    this.init(this.active);
  },
  watch: {
    active(val) {
      this.init(val);
    }
  },
  methods: {
    init(type) {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "ACCOUNT_DETAILS_VIEW",
          direction_type: type ? 0 : 1,
          page: 1,
          count: 10
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.lists = data.Data.lists;
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
@import "../../../../style/mixin.less";
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .mine-content {
    flex: 1;
    overflow: hidden;
    width: 100%;
    /deep/ .van-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      /deep/.van-tabs__content {
        flex: 1;
        overflow-y: auto;
        .list {
          padding: 0.38rem;
        }
      }
    }
  }
}
.noData {
  margin: auto;
  .img {
    width: 2.3rem;
    height: 1.9rem;
    margin: 0.88rem auto 0.3rem;
    .bg-image("../../../../../static/img/zanwushuju");
    background-repeat: no-repeat;
    background-size: contain;
  }
  p {
    color: #4f5260;
    font-size: 0.4rem;
    margin: 0;
  }
}
</style>