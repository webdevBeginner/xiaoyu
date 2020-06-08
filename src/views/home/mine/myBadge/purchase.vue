<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('参与DAO')" left-arrow @click-left="onClickLeft" />
    <div class="main">
      <div class="swiper">
        <div class="icon left" @click="prev"></div>
        <div class="icon right" @click="next"></div>
        <van-swipe
          class="my-swipe"
          :loop="true"
          :show-indicators="false"
          ref="swipe"
          @change="changeLevel"
          v-if="badgeList.length"
        >
          <van-swipe-item v-for="(item,index) in badgeList" :key="index">
            <div class="_main">
              <div class="img" :class="'img' +item.id"></div>
              <div class="cont">
                <p>{{$t(item.product_name)}}</p>
                <p v-if="index<2">{{$t('价值')}} : {{item.min_amount}} ~ {{item.max_amount}}ZEC</p>
                <p v-else>{{$t('价值')}} : ≥ {{item.min_amount}}ZEC</p>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 付款详细 -->
      <div class="content">
        <div class="cont_list" v-if="!LOADING">
          <div class="cont_name">{{$t('价值')}}</div>
          <p v-if="level <3">
            {{obj.min_amount}} ~ {{obj.max_amount}}
            <span>ZEC</span>
          </p>
          <p v-else>
            ≥ {{obj.min_amount}}
            <span>ZEC</span>
          </p>
        </div>
        <div class="cont_list">
          <div class="cont_name">{{$t('支付')}}</div>
          <p class="inputPay">
            <van-field v-model="payMoney" type="number" input-align="right" placeholder="0" />
            <span>ZEC</span>
          </p>
        </div>
        <p>{{$t('当前余额')}}：{{Data.zec}}ZEC</p>
        <van-button @click="BuyBadge" type="info" size="large" color="#006FDF">{{$t('立即支付')}}</van-button>
      </div>
    </div>
    <Charge v-if="pwd_show" @cash-pwd="pay" @close-pay="closePay()"></Charge>
    <loading v-show="LOADING"></loading>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      obj: {
        min_amount: 0
      }, //当前等级
      level: 1,
      Data: {
        zec: 0
      },
      payMoney: "",
      trans_password: "",
      pwd_show: false
    };
  },
  computed: {
    ...mapState(["LOADING", "badgeList", "now_id"]),
    ...mapGetters(["get_chickens"])
  },
  created() {
    this.init();
    this.level = this.now_id ? this.now_id : 1;
    this.obj = this.badgeList[this.level - 1];
  },
  mounted() {
    this.$mount() && this.$refs.swipe.swipeTo(this.level - 1);
  },
  watch: {
    level(val) {
      this.obj = this.badgeList[val - 1];
    },
    payMoney(val) {
      let id = 1;
      this.badgeList.map(_ => {
        if (
          (val >= _.min_amount && val <= _.max_amount) ||
          val >= this.badgeList[_.id - 1].min_amount
        ) {
          id = _.id;
        }
      });
      this.$refs.swipe.swipeTo(id - 1);
    }
  },
  methods: {
    init() {
      this.mview.socket.send({
        data: {
          method: "ACCOUNT_ZEC_BALANCE"
        },
        success: data => {
          if (data.Code == 0) {
            this.Data = data.Data;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onClickLeft() {
      this.$router.push({
        name: "dao"
      });
    },
    BuyBadge() {
      if (this.payMoney < this.badgeList[0].min_amount) {
        this.$toast(
          this.$t("最少不得少于") + `${this.badgeList[0].min_amount} ZEC`
        );
        return;
      }
      if (this.payMoney > this.Data.zec) {
        this.$toast(this.$t("当前余额不足"));
        return;
      } else {
        this.pwd_show = true;
      }
    },
    closePay() {
      this.pwd_show = false;
      this.trans_password = "";
    },
    // 立即提现
    pay(val) {
      this.$store.commit("showLoading");
      this.pwd_show = false;
      this.mview.socket.send({
        data: {
          method: "BUY_PRODUCT_ACTION",
          zec: this.payMoney,
          trans_password: val
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.$toast.success(this.$t("支付成功！"));
            this.$router.push({ name: "dao" });
            localStorage.removeItem("Team");
            this.init();
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
      // 然后调用socket请求开始提现，提现完了之后记得清除密码和提现金额
      this.trans_password = "";
      this.amount = "";
    },
    changeLevel(index) {
      this.level = index + 1;
    },
    prev() {
      this.level = this.level > 1 ? this.level - 1 : 1;
      this.$refs.swipe.prev();
    },
    next() {
      this.level = this.level < 3 ? this.level + 1 : 3;
      this.$refs.swipe.next();
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
      position: relative;
      background: #fff;
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
      .icon {
        width: 0.16rem;
        height: 0.44rem;
        position: absolute;
        top: 0.75rem;
        z-index: 9999;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .left {
        left: 0.2rem;
        .bg-image("../../../../../static/img/xiangzuo");
      }
      .right {
        right: 0.2rem;
        .bg-image("../../../../../static/img/xianyou");
      }
      .my-swipe,
      .van-swipe-item {
        width: 100%;
        color: #101010;
        line-height: 1.94rem;
        text-align: center;
        ._main {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 1.94rem;
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
            line-height: 0.4rem;
            margin: 0;
            &:first-of-type {
              color: #006fdf;
              font-size: 0.32rem;
            }
          }
          .title {
            color: #000;
            font-size: 0.32rem;
          }
        }
      }
    }
    .content {
      width: 100%;
      background: #fff;
      border-radius: 0.3rem;
      box-sizing: border-box;
      padding: 0 0.3rem 1rem;
      margin-bottom: 0.4rem;
      .cont_list {
        color: #999;
        display: flex;
        justify-content: space-between;
        line-height: 0.8rem;
        font-size: 0.24rem;
        padding-top: 0.8rem;
        border-bottom: 1px solid #ececec;
        .cont_name {
          color: #101010;
          font-size: 0.3rem !important;
          width: 1.5rem !important;
          text-align: left;
        }
        .inputPay {
          flex: 1;
          display: flex;
          /deep/input {
            font-size: 0.24rem;
          }
          span {
            padding-left: 0.1rem;
            line-height: 0.88rem;
          }
        }
      }
      p {
        font-size: 0.24rem;
        line-height: 0.8rem;
        text-align: right;
        margin: 0;
        span {
          color: #000;
        }
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