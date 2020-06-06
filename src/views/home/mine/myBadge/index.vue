<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('DAO列表')" left-arrow @click-left="onClickLeft" />
    <div class="list">
      <div class="li" v-for="(item,index) in badgeList" :key="index">
        <div class="now" v-if="money > 0 && now_id === item.id">{{$t('当前级别')}}</div>
        <div class="img"></div>
        <div class="content">
          <div class="title">{{$t(item.product_name)}}</div>
          <p>{{$t('价值')}}≥{{item.min_amount}}ZEC</p>
          <p>{{$t('ZDAO收益/年')}} {{item.release_rate.toFixed(2)}} %</p>
        </div>
        <van-button @click="BuyBadge(item)" class="button" type="info" color="#D0E8FF">{{$t('购买')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      id: 0
    };
  },
  computed: {
    ...mapState(["LOADING", "badgeList", "now_id", "money"]),
    ...mapGetters(["get_chickens"])
  },
  created() {},
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    // 购买或者升级页面
    BuyBadge(item) {
      console.log(this.now_id);
      this.$store.commit("get_now_id", item.id);
      this.$router.push({
        name: "purchase"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/mixin.less";
.register {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: auto;
    padding: 0 0.3rem;
    margin-bottom: 0.3rem;
    .li {
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0;
      border-bottom: 1px solid #ececec;
      position: relative;
      .now {
        position: absolute;
        left: -0.5rem;
        top: 0.1rem;
        height: 0.36rem;
        line-height: 0.36rem;
        color: #fff;
        font-size: 0.2rem;
        padding: 0 0.2rem;
        background: #006fdf;
        box-shadow: 0px 2px 2px 0px rgba(0, 122, 61, 0.35);
        border-radius: 0px 0.16rem 0.16rem 0px;
      }
      .img {
        width: 1.34rem;
        height: 1.4rem;
        margin-right: 0.42rem;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .content {
        flex: 1;
        text-align: left;
        .title {
          font-size: 0.32rem;
          color: #101010;
        }
        .isTit {
          color: #000;
        }
        p {
          color: #888;
          font-size: 0.28rem;
          margin: 0;
          line-height: 0.5rem;
          &:last-of-type {
            font-size: 0.24rem;
            span {
              color: #000;
            }
          }
        }
      }
      &:nth-of-type(1) {
        .img {
          .bg-image("../../../../../static/img/yiji");
        }
      }
      &:nth-of-type(2) {
        .img {
          .bg-image("../../../../../static/img/erji");
        }
      }
      &:nth-of-type(3) {
        .img {
          .bg-image("../../../../../static/img/sanji");
        }
      }
      &:nth-of-type(4) {
        .img {
          .bg-image("../../../../../static/img/siji");
        }
      }
      &:nth-of-type(5) {
        .img {
          .bg-image("../../../../../static/img/wuji");
        }
      }
      /deep/.van-button {
        width: 1.78rem;
        height: 0.62rem;
        line-height: 0.62rem;
        color: #2659ff;
        margin: auto;
        border: 0;
        border-radius: 0.1rem;
      }
      .button {
        color: #2659ff !important;
      }
    }
  }
}
</style>