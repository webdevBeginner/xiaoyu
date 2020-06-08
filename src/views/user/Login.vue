<template>
  <div class="login">
    <loading v-show="LOADING"></loading>
    <div class="loginWrap">
      <div class="logo"></div>
      <!-- {{window.location.href}} -->
      <div class="usernameWrap">
        <p class="title">登录</p>
        <!-- <van-field v-model="userInfo.moblie" :placeholder="$t('请输入手机号')" /> -->
        <MyPhone :userList="userInfo" @change-info="changeInfo"></MyPhone>
        <van-field
          :placeholder="$t('请输入账户密码')"
          @input="userInfo.password = userInfo.password.trim()"
          type="password"
          v-model="userInfo.password"
        />
        <div class="smscode">
          <van-field :placeholder="$t('请输入验证码')" type="text" v-model="userInfo.smscode" />
          <div @click="refreshCode" class="Code">
            <Identify :fresh="flag" @makedCode="getMakedCode"></Identify>
          </div>
        </div>
        <van-button
          @click="login"
          class="loginBtn"
          color="#F04159"
          size="large"
          type="info"
        >{{$t('登录')}}</van-button>
        <p class="linkWrap">
          <span @click="goRegister">{{$t('注册')}}</span>
          <span @click="forgotPWD">{{$t('忘记密码')}}？</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "HelloWorld",
  data () {
    return {
      flag: true, //该值变化，就会触发刷新
      code: "", //刷新后的验证码
      userInfo: {
        moblie: "",
        country: "+86",
        password: "",
        smscode: ''
      }
    };
  },
  created () {
    console.log(localStorage.getItem("isRember"));
  },
  mounted () {
    this.flag = !this.flag;
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    changeInfo (val) {
      this.userInfo = val;
    },
    // 切换验证码
    refreshCode () {
      this.flag = !this.flag;
    },
    getMakedCode (code) {
      this.code = code;
    },
    // 登录
    login () {
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
      if (this.userInfo.smscode != this.code) {
        this.$toast(this.$t("验证码输入错误"));
        return;
      }
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_LOGIN",
          country: this.userInfo.country,
          username: this.userInfo.moblie,
          password: this.userInfo.password
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            // 免登录
            localStorage.setItem("isRember", "true");
            localStorage.setItem("username", this.userInfo.moblie);
            this.$router.push({ name: "Assets" });
            // this.$router.replace({ path: "/login", query: {} });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 跳转到注册页面
    goRegister () {
      this.$router.push({ name: "register" });
    },
    // 跳转到忘记密码页面
    forgotPWD () {
      this.$router.push({ name: "forgotpwd" });
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../style/mixin.less';
/deep/.loginWrap {
  .usernameWrap {
    margin: auto;
    width: 6.32rem;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(147, 147, 147, 0.36);
    border-radius: 0.1rem;
    padding-bottom: 0.3rem;
    .title {
      color: #f04159;
      font-size: 0.36rem;
      line-height: 0.9rem;
      border-bottom: 2px solid #f04159;
      letter-spacing: 0.1rem;
    }
    .smscode {
      position: relative;
      .van-cell {
        margin-bottom: 0.2rem;
        background-repeat: no-repeat;
        background-size: 0.4rem;
        background-position: left;
        .bg-image('../../../static/img/yanzhengma') !important;
      }
      .Code {
        position: absolute;
        right: 0.6rem;
        top: 0;
      }
    }
    .van-cell {
      width: 80%;
      margin: 0 auto 0.2rem;
      background-repeat: no-repeat !important;
      background-size: 0.4rem;
      background-position: left;
      &:nth-of-type(1) {
        background-size: 0.4rem;
        .bg-image('../../../static/img/ren'); //这里是小人人
        .van-field__body {
          flex-direction: row-reverse;
          -ms-flex-direction: row-reverse;
          .van-field__button {
            line-height: 0.56rem;
            padding-left: 0;
            padding-right: 0.5rem;
            .bg-image('../../../static/img/down'); //小箭头
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
        .bg-image('../../../static/img/mima');
      }
    }
  }
}
.login {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  position: relative;
  overflow: hidden;
  z-index: -1;
  &::after {
    content: ' ';
    width: 120%;
    height: 5.4rem;
    position: absolute;
    left: -10%;
    top: 0;
    overflow: hidden;
    background: #ef314b;
    border-radius: 0 0 50% 50%;
    z-index: -1;
  }
}
.logo {
  width: 2.08rem;
  height: 2.44rem;
  margin: 2.4rem auto 1rem;
  .bg-image('../../../static/img/logo-dl');
  background-size: contain;
  background-repeat: no-repeat;
}
.linkWrap {
  width: 4.6rem;
  margin: 0.3rem auto 0;
  color: #ff6d70;
  display: flex;
  justify-content: space-between;
}
.loginBtn {
  width: 80%;
  margin: 0.2rem auto 0;
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
