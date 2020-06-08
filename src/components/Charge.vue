<template>
  <div class="Charge" style="height:100%;position: fixed">
    <!-- 弹出那个输入提现密码的弹出框 -->
    <van-popup
      :duration="0.3"
      :overlay="false"
      @click-overlay="nowCash(0)"
      @closed="nowCash(0)"
      closeable
      v-model="password_show"
    >
      <div class="title">{{$t('输入密码')}}</div>
      <input
        :placeholder="$t('请输入密码')"
        autofocus="autofocus"
        type="password"
        v-model="trans_password"
      />
      <van-button
        :disabled="trans_password.length <6 || isDisable"
        @click="nowCash(1)"
        color="#EF314B"
        size="large"
        type="info"
      >{{$t(btn_mes)}}</van-button>
    </van-popup>
    <div class="pop"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDisable: false,
      rate: 0.98,
      balance: 5000,
      coin_type: "NOG",
      amount: "",
      bind_address: "0x841A169Aa95c32A244421C7323C576267DFb4e8a ",
      trans_password: "",
      password_show: true
    };
  },
  props: {
    btn_mes: {
      default: "立即支付",
      type: String
    }
  },
  methods: {
    onInput (key) {
      this.trans_password = (this.trans_password + key).slice(0, 6);
    },
    onDelete () {
      this.trans_password = this.trans_password.slice(
        0,
        this.trans_password.length - 1
      );
    },
    // 提交密码
    nowCash (type) {
      if (this.trans_password.length >= 6 && type) {
        this.isDisable = true;
        setTimeout(() => {
          this.$emit("cash-pwd", this.trans_password);
        }, 1000);
      } else {
        this.$emit("close-pay", false);
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.Charge {
  /deep/.van-popup {
    width: 5.6rem;
    height: 4.16rem;
    background: #fff;
    border-radius: 0.14rem;
    overflow: hidden;
    .title {
      font-size: 0.34rem;
      color: #333;
      font-weight: 500;
      margin: 0.56rem auto;
    }
    input {
      display: inline-block;
      width: 4.72rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border: 1px solid #e5e5e5;
      outline: none;
      font-size: 0.3rem;
      text-align: center;
    }
    /deep/.van-popup__close-icon {
      font-size: 0.24rem;
      color: #999;
    }
    /deep/.van-button {
      width: 80% !important;
      margin: 0.3rem auto !important;
    }
  }
  /deep/.van-number-keyboard {
    z-index: 3000;
  }
  .pop {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
  }
}
</style>