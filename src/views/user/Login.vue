<template>
  <div class="login">
    <loading v-show="LOADING"></loading>
    <div class="loginWrap">
      <div class="logo"></div>
      <!-- {{window.location.href}} -->
      <div class="usernameWrap">
        <!-- <van-field v-model="userInfo.moblie" :placeholder="$t('请输入手机号')" /> -->
        <MyPhone
          :userList="userInfo"
          @change-info="changeInfo"
        ></MyPhone>
        <van-field
          type="password"
          v-model="userInfo.password"
          @input="userInfo.password = userInfo.password.trim()"
          :placeholder="$t('请输入账户密码')"
        />
        <p class="linkWrap">
          <span @click="goRegister">{{$t('注册')}}</span>
          <span @click="forgotPWD">{{$t('忘记密码')}}？</span>
        </p>
        <van-button
          class="loginBtn"
          round
          type="info"
          color="linear-gradient(to right, #FEE449, #FFC233)"
          size="large"
          @click="login"
        >{{$t('登录')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "HelloWorld",
  data() {
    return {
      userInfo: {
        moblie: "",
        country: "+86",
        password: ""
      }
    };
  },
  created() {
    console.log(localStorage.getItem("isRember"));
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    changeInfo(val) {
      this.userInfo = val;
    },
    // 登录
    login() {
      let reg = /^[1]([3-9])[0-9]{9}$/;
      let reg_pwd = /[A-Za-z0-9]$/;
      if (this.userInfo.moblie === "") {
        this.$toast(this.$t("账户不得为空"));
        return;
      }
      if (this.userInfo.country === "+86") {
        if (!reg.test(this.userInfo.moblie)) {
          this.$toast(this.$t("请输入正确的手机号"));
          return;
        }
      }
      if (this.userInfo.password === "") {
        this.$toast(this.$t("密码不得为空"));
        return;
      } else if (
        6 > this.userInfo.password.length ||
        16 < this.userInfo.password.length
      ) {
        this.$toast(this.$t("密码长度为6~16位"));
        return;
      } else if (!reg_pwd.test(this.userInfo.password)) {
        this.$toast(this.$t("密码只能输入数字和字母"));
        return;
      }
      this.$store.commit("showLoading");

      // 免登录
      localStorage.setItem("isRember", "true");
      localStorage.setItem("username", this.userInfo.moblie);
      this.$router.push({ name: "shouye" });

      // this.mview.socket.send({
      //   data: {
      //     method: "USER_LOGIN",
      //     country: this.userInfo.country,
      //     username: this.userInfo.moblie,
      //     password: this.userInfo.password
      //   },
      //   success: data => {
      //     this.$store.commit("hideLoading");
      //     if (data.Code == 0) {
      //       // 免登录
      //       localStorage.setItem("isRember", "true");
      //       localStorage.setItem("username", this.userInfo.moblie);
      //       this.$router.push({ name: "shouye" });
      //       // this.$router.replace({ path: "/login", query: {} });
      //     } else {
      //       this.$toast(this.$t(data.Message));
      //     }
      //   }
      // });
    },
    // 跳转到注册页面
    goRegister() {
      this.$router.push({ name: "register" });
    },
    // 跳转到忘记密码页面
    forgotPWD() {
      this.$router.push({ name: "forgotpwd" });
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../style/mixin.less";
/deep/.loginWrap {
  .usernameWrap {
    margin: auto;
    width: 5.7rem;
    .van-cell {
      margin-bottom: 0.2rem;
      background-repeat: no-repeat !important;
      background-size: 0.35rem;
      background-position: left;
      &:nth-of-type(1) {
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
        }
        .van-action-sheet__item {
          border-bottom: 1px solid #f7f1f1f1;
        }
        .van-cell:not(:last-child)::after {
          border-color: #515151;
          left: 0;
        }
      }
      &:nth-of-type(2) {
        .bg-image("../../../static/img/mima");
      }
    }
  }
}
.login {
  height: 100%;
  color: #ffe348;
  font-size: 0.28rem;
  .bg-image("../../../static/img/beijing");
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}
.logo {
  height: 4.66rem;
  width: 2.98rem;
  margin: 1.5rem auto 1rem;
  .bg-image("../../../static/img/logo-dl");
  background-size: contain;
  background-repeat: no-repeat;
}
.linkWrap {
  width: 4.6rem;
  margin: 0.3rem auto 1rem;
  display: flex;
  justify-content: space-between;
}
.loginBtn {
  letter-spacing: 0.1rem;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  .logo {
    height: 3.66rem;
    width: 1.98rem;
    margin: 1rem auto 0.5rem;
  }
}
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .logo {
    height: 4.66rem;
    width: 2.98rem;
    margin: 1.48rem auto 1rem;
  }
}
</style>
