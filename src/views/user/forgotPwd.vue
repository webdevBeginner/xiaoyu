<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <loading v-show="LOADING"></loading>
    <van-nav-bar :title="$t('找回密码')" left-arrow @click-left="onClickLeft" />
    <!-- logo -->
    <div class="register">
      <div class="logo"></div>
      <div class="usernameWrap">
        <MyPhone :userList="registerInfo" @change-info="changeInfo"></MyPhone>
        <Smscode :userList="registerInfo" @change-code="changeCode"></Smscode>
        <van-field
          type="password"
          v-model="registerInfo.password"
          :placeholder="$t('请设置6-16位的密码')"
        />
        <van-field type="password" v-model="registerInfo.re_password" :placeholder="$t('请重新输入密码')" />
      </div>
      <van-button
        class="loginBtn"
        round
        type="info"
        color="linear-gradient(to right, #FEE449, #FFC233)"
        size="large"
        @click="loginBtn"
      >{{$t('确定')}}</van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      // isCode: true,
      registerInfo: {
        moblie: "",
        country: "+86",
        smscode: "", //验证码
        password: "", //密码
        re_password: "" // 重新输入密码字段
      }
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    changeInfo(val) {
      this.registerInfo = val;
    },
    changeCode(val) {
      this.registerInfo = val;
    },
    onClickLeft() {
      this.$router.push({ name: "login" });
    },
    // 下一步
    loginBtn() {
      // 当所有的验证通过之后进入下一步
      let reg = /^[1]([3-9])[0-9]{9}$/;
      let reg_pwd = /[A-Za-z0-9]$/;
      if (this.registerInfo.moblie === "") {
        this.$toast(this.$t("账户不得为空"));
        return;
      }
      if (this.registerInfo.country === "+86") {
        if (!reg.test(this.registerInfo.moblie)) {
          this.$toast(this.$t("请输入正确的手机号"));
          return;
        }
      }
      if (this.registerInfo.smscode === "") {
        this.$toast(this.$t("验证码不得为空"));
        return;
      }
      if (this.registerInfo.password === "") {
        this.$toast(this.$t("密码不得为空"));
        return;
      } else if (
        6 > this.registerInfo.password.length ||
        16 < this.registerInfo.password.length
      ) {
        this.$toast(this.$t("密码长度为6~16位"));
        return;
      } else if (!reg_pwd.test(this.registerInfo.password)) {
        this.$toast(this.$t("密码只能输入数字和字母"));
        return;
      }
      if (this.registerInfo.password !== this.registerInfo.re_password) {
        this.$toast(this.$t("两次密码输入不一致"));
        return;
      }
      if (this.registerInfo.recomid === "") {
        this.$toast(this.$t("邀请码不得为空"));
        return;
      }
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "FIND_MOBILE_ACTION",
          username: this.registerInfo.moblie,
          country: this.registerInfo.country,
          smscode: this.registerInfo.smscode,
          recomid: this.registerInfo.recomid,
          password: this.registerInfo.password,
          repassword: this.registerInfo.re_password
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.$toast(this.$t("密码设置成功，请重新登录！"));
            this.$router.push({ name: "login" });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin.less";
.register {
  background: rgb(34, 35, 55);
  height: 100%;
  overflow: hidden;
  .van-nav-bar__title {
    letter-spacing: 0rem !important;
  }
}
.logo {
  width: 2.6rem;
  height: 4.12rem;
  margin: 0.5rem auto 0.2rem;
  .bg-image("../../../static/img/logo-dl");
  background-size: contain;
  background-repeat: no-repeat;
}
/deep/.usernameWrap {
  margin: auto;
  width: 5.7rem;
  .yanzhengma {
    color: #fff;
  }
  .smscode {
    .van-cell {
      margin-bottom: 0.2rem;
      background-repeat: no-repeat;
      background-size: 0.45rem;
      background-position: left;
      .bg-image("../../../static/img/yanzhengma") !important;
    }
  }
  .van-cell {
    margin-bottom: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.4rem;
    background-position: left;
    .van-field__button {
      height: 0.56rem;
      .van-button {
        font-size: 0.3rem;
        .van-count-down,
        span {
          color: #fee449;
          line-height: 0.56rem;
          float: left;
          margin-right: 5px;
        }
      }
      .van-button--disabled {
        background: transparent !important;
      }
    }

    &:nth-of-type(3) {
      .bg-image("../../../static/img/mima");
    }
    &:nth-of-type(4) {
      .bg-image("../../../static/img/mima-sure");
    }
  }
  .myPhone {
    .van-cell {
      margin-bottom: 0.2rem;
      background-repeat: no-repeat !important;
      background-size: 0.35rem;
      background-position: left;
      background-size: 0.5rem;
      .bg-image("../../../static/img/ren"); //这里是小人人

      .van-field__body {
        flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        .van-field__button {
          line-height: 0.56rem;
          padding-left: 0;
          padding-right: 0.5rem;
          .bg-image("../../../static/img/down"); //小箭头
          background-repeat: no-repeat;
          background-size: 0.14rem;
          background-position: 80% center;
        }
        .van-action-sheet__item {
          border-bottom: 1px solid #f7f1f1f1;
        }
        .van-cell:not(:last-child)::after {
          border-color: #515151;
          left: 0;
        }
      }
    }
  }
}
.loginBtn {
  width: 5.7rem;
  margin-top: 0.2rem;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  .logo {
    height: 3.66rem;
    width: 1.98rem;
    margin: 0.2rem auto 0;
  }
}
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .logo {
    height: 4.66rem;
    width: 2.98rem;
    margin: 1rem auto 1rem;
  }
}
</style>