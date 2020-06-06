<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('钱包管理')" left-arrow @click-left="onClickLeft" />
    <div class="mine-content">
      <div v-if="!isBtn" class="info">
        <van-field
          v-model="info.address"
          :label="$t('提币地址：')"
          clearable
          :placeholder="$t('请输入提币地址')"
        />
        <van-field v-model="info.mark" :label="$t('短信验证：')" :placeholder="$t('请输入验证码')">
          <van-button slot="button" size="small">{{$t('获取验证码')}}</van-button>
        </van-field>
      </div>
      <div v-if="isBtn" class="lockMoneyAdd">
        <p>{{$t('当前提币地址')}}</p>
        <p>
          0x841A169Aa95c32A244421C7323C576267DFb4e8a
          <img
            :src="require('#/img/qianbaosuoding@2x.png')"
            alt
          />
        </p>
      </div>
      <van-button
        id="sureBtn"
        round
        :plain="isBtn"
        :class="{suodingBtn: isBtn}"
        :disabled="info.address=== '' ? true : false"
        color="linear-gradient(to right, #FEE449, #FFC233)"
        size="large"
        @click="submit"
      >{{$t(isBtn ? '重新绑定' : '确认绑定')}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      isBtn: false,
      info: {
        address: "0x841A169Aa95c32A244421C7323C576267DFb4e8a",
        mark: ""
      }
    };
  },
  methods: {
    submit() {
      if (this.info.address.length < 16) {
        this.$toast(this.$t("请输入正确的提币地址"));
        return;
      } else if (this.info.mark === "") {
        this.$toast(this.$t("请输入验证码"));
        return;
      } else {
        // 这里调用socket服务
        this.isBtn = true;
      }
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
    width: 100%;
    .info {
      width: 80%;
      margin: 1rem auto 1.2rem;
      /deep/.van-cell__title {
        font-size: 0.3rem;
        color: #000;
      }
      /deep/.van-field__body {
        font-size: 0.3rem;
      }
    }
    .lockMoneyAdd {
      width: 6.54rem;
      height: 3.65rem;
      margin: 0.48rem auto;
      p {
        width: 5.2rem;
        text-align: center;
        font-size: 0.3rem;
        color: #212437;
        margin: 0 auto 0;
        overflow: hidden;
        word-break: break-all;
        line-height: 0.6rem;
        &:first-of-type {
          font-size: 0.32rem;
          font-weight: 900;
          line-height: 0.86rem;
          margin-bottom: 0.2rem;
        }
        img {
          width: 0.24rem;
          margin-left: 0.1rem;
        }
      }
    }
    #sureBtn {
      width: 80%;
      margin: 0 auto;
    }
    /deep/.van-button--disabled,
    /deep/.van-button--round {
      color: #000 !important;
      border: 0 !important;
    }
    .suodingBtn {
      border: 1px solid !important;
      color: #000 !important;
    }
  }
}
</style>