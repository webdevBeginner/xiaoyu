<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('转账')" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <!-- 内容部分 -->
    <div class="mine-content">
      <div class="money_number">
        <p>{{$t('转账数量')}}：</p>
        <div class="input_money">
          <input
            v-model="amount"
            type="number"
            :maxlength="6"
            :placeholder="$t('最小提币数量') + act_data.minMoney + 'ZEC'"
          />
        </div>
        <p class="balance">
          <span>
            {{$t('可用')}}
            <i>{{act_data.balance}}</i>
            {{get_chickens(act_data.type, "coinKeyType").name}}
          </span>
          <span v-if="amount && (amount - (+act_data.feeRate) >0)">
            ，
            {{$t('实际到账数量')}}
            <i>{{(amount - (+act_data.feeRate)).toFixed(8)}}</i>
            {{get_chickens(act_data.type, "coinKeyType").name}}
          </span>
        </p>
      </div>
      <!-- 手续费 -->
      <div class="money_number bind_address">
        <div class="input_address">
          <span>{{$t('提现手续费')}} {{+act_data.feeRate}}</span>
          <span>ZEC</span>
        </div>
      </div>
      <!-- 提币地址 -->
      <div class="money_number bind_address">
        <p>{{$t('转账地址')}}：</p>
        <van-field
          class="input_USDT"
          rows="1"
          v-model="act_data.address"
          autosize
          type="textarea"
          :placeholder="$t('请输入（火币网）ZEC地址')"
        >
          <template #button>
            <van-button size="mini" type="default" @click="startRecognize">
              <van-icon name="scan" />
            </van-button>
          </template>
        </van-field>
      </div>
      <!-- 确定提现 -->
      <div class="sureBtn">
        <van-button
          type="info"
          :disabled="act_data.address === ''"
          color="#006FDF"
          size="large"
          @click="sureCash"
        >{{$t('确定转账')}}</van-button>
        <p>{{$t(`温馨提示`)}}：</p>
        <p>1、{{$t(`最少提币`)}}{{act_data.minMoney}} ZEC</p>
        <p>2、{{$t(`不支持匿名转账提币`)}}</p>
        <p>{{`3、 ${$t('每笔转账将扣除价值')}${+act_data.feeRate}ZEC${$t('的矿工费。')}`}}</p>
      </div>
    </div>
    <QrScanner v-if="scan_show" @showResult="showResult"></QrScanner>
    <Charge v-if="pwd_show" @cash-pwd="pay" @close-pay="closePay()"></Charge>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      act_data: {
        rate: 0.98,
        balance: 0,
        feeRate: 0.05,
        type: 2,
        address: "",
        minMoney: ""
      },
      amount: "",
      transpassword: "",
      pwd_show: false,
      scan_show: false
    };
  },
  watch: {
    amount(val) {
      if (Math.floor(val) > 1000000) {
        this.amount = 1000000;
        this.$toast("我们是有上限的哦！");
        return;
      }
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    },
    // 去修改提币地址的页面
    goWalletManagement() {
      this.$router.push({ name: "WalletManagement" });
    },
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "BALANCE_ASSET_VIEW",
          type: 4
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.act_data = data.Data;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },

    // 确认开始提现
    sureCash() {
      let reg = /^(t|T)[0-9a-zA-Z]{34}$/;
      if (!reg.test(this.act_data.address)) {
        this.$toast(this.$t("请输入正确的提币地址"));
        return;
      }
      if (this.amount === "0" || this.amount === "") {
        this.$toast(this.$t("请输入您的提现数量"));
      } else if (+this.amount > +this.act_data.balance) {
        this.$toast(this.$t("提现金额超出"));
        return;
      } else if (this.amount < this.act_data.minMoney) {
        this.$toast(this.$t("最小提现金额不得小于" + this.act_data.minMoney));
        return;
      } else if (this.amount > 1000000) {
        this.$toast(this.$t("最大提现金额不得大于1000000"));
        return;
      } else if (!this.act_data.has_transpassword) {
        this.$toast(this.$t("请先设置交易密码"));
        return;
      } else {
        this.pwd_show = true;
      }
    },
    // 提现记录页面
    history() {
      this.$router.push({ path: "/home/WithdrawalsRecord" });
    },
    closePay() {
      this.pwd_show = false;
      this.trans_password = "";
    },
    // 立即提现
    pay(val) {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_TRADE_ACTION",
          type: 4,
          amount: +this.amount,
          address: this.act_data.address,
          transpassword: val
        },
        success: data => {
          this.$store.commit("hideLoading");
          this.pwd_show = false;
          this.transpassword = "";
          if (data.Code == 0) {
            // this.act_data = data.Data;
            this.$toast.success("提现成功！");
            this.init();
            this.amount = "";
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },

    //初始化扫描控件
    startRecognize() {
      this.scan_show = true;
    },
    showResult(val) {
      this.scan_show = false;
      this.act_data.address = val ? val : this.act_data.address;
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
  .mine-content {
    width: 100%;
    padding: 0.5rem auto;
    flex: 1;
    overflow: auto;
    background: #f8f8f8;
    .money_number {
      text-align: left;
      width: 100%;
      padding: 0 0.4rem;
      margin-top: 0.3rem;
      box-sizing: border-box;
      p {
        font-size: 0.3rem;
        line-height: 0.6rem;
        margin: 0;
      }
      .input_money {
        height: 0.86rem;
        line-height: 0.86rem;
        background: #fff;
        border-radius: 0.1rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.26rem;
        color: #999;
        font-size: 0.3rem;
        overflow: hidden;
        input {
          flex: 1;
          background: transparent;
          border: 0;
        }
        i {
          font-style: normal;
          color: #000;
        }
      }
      .balance {
        font-size: 0.24rem;
        color: #999;
        i {
          font-style: normal;
          color: #006fdf;
        }
      }
    }
    .bind_address {
      margin: 0.3rem auto;

      .input_address {
        width: 100%;
        margin: 0 auto;
        font-size: 0.28rem;
        display: flex;
        justify-content: space-between;
        color: #999;
        padding: 0.28rem;
        box-sizing: border-box;
        background: #fff;
        border-radius: 0.1rem;
        word-break: break-all;
      }
      .clear {
        justify-content: flex-start;
        .qbgl {
          color: #000;
        }
      }
      .input_USDT {
        width: 100%;
        background: #fff;
        color: #999;
        padding: 0.28rem;
        border-radius: 0.1rem;
        height: auto !important;
        line-height: 0.4rem;
        /deep/.van-field__control {
          height: 0.8rem !important;
        }
      }
    }
    .sureBtn {
      width: 5.8rem;
      margin: 0 auto;
      .van-button--disabled {
        margin-top: 0.2rem;
      }
      p {
        font-size: 0.24rem;
        color: #999;
        text-align: left;
      }
    }
  }
}
/deep/.van-button--mini {
  text-align: right;
  &:active {
    background: transparent !important;
  }
}
</style>