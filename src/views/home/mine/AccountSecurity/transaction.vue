<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('修改交易密码')" left-arrow @click-left="onClickLeft" />
    <div class="mine-content">
      <div class="usernameWrap">
        <MyPhone :userList="registerInfo" @change-info="changeInfo"></MyPhone>
        <Smscode :userList="registerInfo" @change-code="changeCode"></Smscode>
        <van-field
          type="password"
          v-model="registerInfo.trans_password"
          @input="registerInfo.trans_password = registerInfo.trans_password.trim()"
          :placeholder="$t('请输入6位新的交易密码')"
        />
        <van-field
          type="password"
          v-model="registerInfo.retradepassword"
          @input="registerInfo.retradepassword = registerInfo.retradepassword.trim()"
          :placeholder="$t('请重新输入新交易密码')"
        />
      </div>
      <van-button
        class="loginBtn"
        type="info"
        color="#000"
        size="large"
        @click="sure_edit"
      >{{$t('确定')}}</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      registerInfo: {
        moblie: "",
        country: "+86",
        smscode: "", //验证码
        trans_password: "",
        retradepassword: ""
      }
    };
  },
  computed: {
    ...mapState(["LOADING"])
  },
  methods: {
    changeInfo(val) {
      this.registerInfo = val;
    },
    changeCode(val) {
      this.registerInfo = val;
    },
    // 确定修改
    sure_edit() {
      let reg_pwd = /^[0-9]{6}$/;
      if (this.registerInfo.smscode === "") {
        this.$toast(this.$t("验证码不得为空"));
        return;
      }
      if (this.registerInfo.trans_password === "") {
        this.$toast(this.$t("密码不得为空"));
        return;
      } else if (!reg_pwd.test(this.registerInfo.trans_password)) {
        this.$toast(this.$t("密码只能输入6位数字"));
        return;
      }
      if (
        this.registerInfo.trans_password !== this.registerInfo.retradepassword
      ) {
        this.$toast(this.$t("两次密码输入不一致"));
        return;
      }
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_TRANS_PASSWORD_EDIT",
          phoneNo: this.registerInfo.moblie,
          smscode: this.registerInfo.smscode,
          country: this.registerInfo.country,
          trans_password: this.registerInfo.trans_password,
          retradepassword: this.registerInfo.retradepassword
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.$toast.success(this.$t("交易密码修改成功！"));
            this.$router.push({ path: "/home/mine" });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
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
  overflow: hidden;
  .mine-content {
    width: 80%;
    margin: 0.8rem auto;
    .usernameWrap {
      margin: auto;
      width: 5.7rem;
      .yanzhengma {
        color: #fff;
      }

      /deep/.smscode {
        .van-cell {
          margin-bottom: 0.2rem;
          background-repeat: no-repeat;
          background-size: 0.45rem;
          background-position: left;
          .bg-image("../../../../../static/img/yanzhengma");
        }
      }

      /deep/.van-cell {
        margin-bottom: 0.2rem;
        background-repeat: no-repeat;
        background-size: 0.4rem;
        background-position: left;
        input {
          padding-left: 0.6rem;
        }
        &:nth-of-type(3) {
          .bg-image("../../../../../static/img/mima-blue");
        }
        &:nth-of-type(4) {
          .bg-image("../../../../../static/img/mima-sure");
        }
      }
      /deep/.myPhone {
        .van-cell {
          margin-bottom: 0.2rem;
          background-repeat: no-repeat;
          background-size: 0.44rem;
          background-position: left;
          .bg-image("../../../../../static/img/shoujihao"); //小手机
          .van-field__body {
            flex-direction: row-reverse;
            -ms-flex-direction: row-reverse;
            .van-field__button {
              padding-left: 0.6rem;
              padding-right: 0.5rem;
              .bg-image("../../../../../static/img/down"); //小箭头
              background-repeat: no-repeat;
              background-size: 0.14rem;
              background-position: 80% center;
              line-height: 0.56rem;
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
        input {
          padding-left: 0;
        }
      }
    }
    .loginBtn {
      width: 5.7rem;
      margin-top: 0.2rem;
    }
  }
}
</style>