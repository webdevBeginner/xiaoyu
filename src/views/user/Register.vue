<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <loading v-show="LOADING"></loading>
    <van-nav-bar
      :title="$t('注册')"
      @click-left="onClickLeft"
      left-arrow
      v-if="!$route.query.recomid"
    />
    <!-- logo -->
    <div class="reg">
      <div class="logo-border">
        <div class="logo"></div>
      </div>
      <div class="usernameWrap">
        <MyPhone :userList="registerInfo" @change-info="changeInfo"></MyPhone>
        <Smscode :userList="registerInfo" @change-code="changeCode"></Smscode>
        <van-field
          :placeholder="$t('请设置6-16位的密码')"
          @input="registerInfo.password = registerInfo.password.trim()"
          type="password"
          v-model="registerInfo.password"
        />
        <van-field
          :placeholder="$t('请再次输入密码')"
          @input="registerInfo.re_password = registerInfo.re_password.trim()"
          type="password"
          v-model="registerInfo.re_password"
        />
        <van-field :placeholder="$t('请输入邀请码')" v-model="registerInfo.recomid" />
      </div>
      <van-button
        :disabled="!isActive"
        @click="register"
        class="loginBtn"
        color="#F04159"
        size="large"
        type="info"
      >{{$t('注册')}}</van-button>
      <p class="linkWrap">
        <span :class="isActive?'isClass':''" @click="changeActive" class="position"></span>
        {{$t('注册即表示同意')}}
        <span @click="isShow = true">《{{$t('HGF平台服务协议')}}》</span>
      </p>
    </div>
    <div class="download" v-if="$route.query.recomid">
      <div class="logo-btn"></div>
      <div @click="openApp" class="botton">{{$t('打开App')}}</div>
    </div>
    <!-- 弹出框 -->
    <div class="shadow" v-show="isShow"></div>
    <div class="show" v-show="isShow">
      <div class="actio">
        <p class="title">{{$t('HGF平台服务协议')}}</p>
        <div class="content" v-html="text"></div>
      </div>
      <van-button @click="isShow = false" color="#F04159" size="large" type="info">{{$t('确定')}}</van-button>
    </div>
  </div>
</template>

<script>
import list from "../../utils/text.json";
import listEn from "../../utils/text-en.json";
import { mapGetters, mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      text: "",
      isShow: false,
      isCode: true,
      isActive: true,
      registerInfo: {
        moblie: "",
        country: "+86",
        smscode: "", //验证码
        recomid: "", //邀请码
        password: "", //密码
        re_password: "" // 重新输入密码字段
      }
    };
  },
  created () {
    this.text =
      localStorage.getItem("language") === "zh" ? list.text : listEn.text;
    this.registerInfo.recomid = this.$route.query.recomid;
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    changeInfo (val) {
      this.registerInfo = val;
    },
    changeCode (val) {
      this.registerInfo = val;
    },
    onClickLeft () {
      this.$router.push({ name: "login" });
    },
    changeActive () {
      this.isActive = !this.isActive;
    },
    openApp () {
      window.location.href = "http://f.8ios.cn/v/etmaya";
    },
    // 注册
    register () {
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
          method: "USER_REGISTER_ACTION",
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
            this.$toast(this.$t("注册成功！"));
            this.$route.query.recomid
              ? this.openApp()
              : this.$router.push({ name: "login" });
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
@import '../../style/mixin.less';

.register {
  background: #f9f9f9;
  height: 100%;
  overflow: hidden;
  .download {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.32rem;
    background: #f04159;
    padding: 0.22rem 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    z-index: 999;
    .logo-btn {
      height: 0.6rem;
      width: 1.62rem;
      margin: 0;
      .bg-image('../../../static/img/logo-register');
      background-size: contain;
      background-repeat: no-repeat;
    }
    .botton {
      color: #fff;
      font-size: 0.28rem;
      width: 1.4rem;
      height: 0.44rem;
      line-height: 0.44rem;
      border: 2px solid #fff;
      border-radius: 0.1rem;
    }
  }
}
/deep/.reg {
  position: relative;
  height: 100%;
  .logo-border {
    width: 4.14rem;
    height: 1.72rem;
    margin: 1rem auto 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ef314b;
    border-radius: 0.1rem;
    .logo {
      height: 1.37rem;
      width: 3.84rem;
      background: #ef314b;
      border-radius: 0.1rem;
      .bg-image('../../../static/img/logo-register');
      background-size: 3rem 1.06rem;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
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
      background-size: 0.4rem;
      background-position: left;
      .bg-image('../../../static/img/yanzhengma') !important;
    }
  }
  .van-cell {
    margin-bottom: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.4rem;
    background-position: left;
    .van-field__button {
      line-height: 0.56rem;
      height: 0.56rem;
      .van-button {
        font-size: 0.28rem;
        .van-count-down,
        span {
          color: #f04159;
          line-height: 0.56rem;
          float: left;
          margin-right: 5px;
        }
      }
      .van-button--disabled {
        background: transparent !important;
      }
    }
    &:nth-of-type(1) {
      .bg-image('../../../static/img/shoujihao');
    }

    &:nth-of-type(3) {
      .bg-image('../../../static/img/mima');
    }
    &:nth-of-type(4) {
      .bg-image('../../../static/img/mima-sure');
    }
    &:nth-of-type(5) {
      .bg-image('../../../static/img/yaoqinghaoyou');
    }
  }
  .myPhone {
    .van-cell {
      margin-bottom: 0.2rem;

      .van-field__body {
        flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        .van-field__button {
          padding-left: 0;
          padding-right: 0.5rem;
          .bg-image('../../../static/img/down'); //小箭头
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
  letter-spacing: 0.1rem;
}
.linkWrap {
  margin: 0.3rem auto 1rem;
  color: #888888;
  text-align: center;
  font-size: 0.26rem;
  display: flex;
  justify-content: center;
  line-height: 0.8rem;
  .position {
    display: inline-block;
    width: 0.34rem;
    height: 0.34rem;
    .bg-image('../../../static/img/buxuan');
    background-repeat: no-repeat;
    background-size: 0.34rem;
    background-position: center;
    padding: 0.2rem;
  }
  .isClass {
    .bg-image('../../../static/img/xuan');
    z-index: 100;
  }
  span {
    color: #f04159;
    text-decoration: underline;
  }
}
.shadow {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.49);
  z-index: 10;
}
.show {
  width: 80%;
  height: 80%;
  background: #fff;
  border-radius: 0.3rem;
  position: fixed;
  top: 10%;
  left: 10%;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  box-sizing: border-box;
  overflow: hidden;
  .actio {
    flex: 1;
    overflow: auto;
    .title {
      font-size: 0.32rem;
      margin: 0;
      line-height: 0.6rem;
      color: #000;
    }
    .content {
      p {
        text-align: left !important;
        color: #333333;
        font-size: 0.3rem;
      }
    }
  }
  .van-button {
    margin-top: 0.28rem;
    height: 0.86rem;
  }
}
</style>