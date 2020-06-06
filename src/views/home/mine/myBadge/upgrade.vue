<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('升级兑换')" left-arrow @click-left="onClickLeft" />
    <div class="main">
      <div class="swiper">
        <div class="_main">
          <div class="img" :class="'img' + level"></div>
          <div class="cont">
            <p class="title">{{$t(get_chickens(level,'badgeView').name)}}</p>
            <p>{{$t('价值')}}： 500USDT</p>
          </div>
        </div>
      </div>
      <!-- 付款详细 -->
      <div class="content">
        <div class="cont_list">
          <div class="cont_name">{{$t('升级所需')}}</div>
          <span>300USDT</span>
        </div>
        <p>≈ 200NOG</p>

        <div class="cont_list">
          <div class="cont_name">{{$t('共需支付')}}</div>
          <span>200NOG</span>
        </div>
        <p>{{$t('当前余额')}}：12000NOG</p>

        <van-button
          @click="BuyBadge"
          round
          type="info"
          size="large"
          color="linear-gradient(to right, #FEE449, #FFC233)"
        >{{$t('立即支付')}}</van-button>
        <p class="pre">{{$t('按实际支付时USDT和NOG价格计算')}}</p>
      </div>
    </div>
    <Charge v-if="pwd_show" @cash-pwd="pay" @close-pay="closePay()"></Charge>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      level: 2,
      trans_password: "",
      amount: 0,
      pwd_show: false
    };
  },
  computed: {
    ...mapGetters(["get_chickens"])
  },
  mounted() {
    this.level = this.$route.params.item.level;
  },
  methods: {
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    },
    BuyBadge() {
      this.pwd_show = true;
    },
    closePay() {
      this.pwd_show = false;
      this.trans_password = "";
    },
    // 立即提现
    pay(val) {
      this.pwd_show = false;
      // 然后调用socket请求开始提现，提现完了之后记得清除密码和提现金额
      this.trans_password = "";
      this.amount = "";
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
  .main {
    padding: 0.4rem 0.3rem;
    box-sizing: border-box;
    .swiper {
      width: 100%;
      height: 1.94rem;
      background: rgba(255, 255, 255, 0.21);
      border-radius: 0.3rem;
      margin-bottom: 0.4rem;
      color: #888;
      font-size: 0.28rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .van-icon {
        color: #686664;
        font-size: 0.5rem;
      }
      ._main {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0.8rem;
        .img {
          width: 1.3rem;
          height: 1.3rem;
          margin-right: 0.6rem;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .img1 {
          .bg-image("../../../../../static/img/yiji");
        }
        .img2 {
          .bg-image("../../../../../static/img/erji");
        }
        .img3 {
          .bg-image("../../../../../static/img/sanji");
        }
        .img4 {
          .bg-image("../../../../../static/img/siji");
        }
        .img5 {
          .bg-image("../../../../../static/img/wuji");
        }

        p {
          text-align: left;
          margin: 0;
        }
        .title {
          color: #000;
          font-size: 0.32rem;
        }
      }
    }
    .content {
      width: 100%;
      background: rgba(255, 255, 255, 0.21);
      border-radius: 0.3rem;
      box-sizing: border-box;
      padding: 0.3rem;
      margin-bottom: 0.4rem;
      .cont_list {
        color: #999;
        display: flex;
        justify-content: space-between;
        line-height: 0.8rem;
        border-bottom: 1px solid #686664;
        .cont_name {
          color: #000;
        }
      }
      p {
        text-align: right;
        color: #000;
      }
      .van-button {
        margin-top: 0.7rem;
        width: 5.08rem;
        height: 0.88rem;
        line-height: 0.88rem;
      }
      .pre {
        font-size: 0.26rem;
        color: #999;
        text-align: center;
        line-height: 0.6rem;
        margin: 0;
        margin-bottom: 0.3rem;
      }
    }
  }
}
</style>